"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityHydrator = void 0;
const common_1 = require("@nestjs/common");
const unique_1 = require("@vendure/common/lib/unique");
const errors_1 = require("../../../common/error/errors");
const transactional_connection_1 = require("../../../connection/transactional-connection");
const product_variant_entity_1 = require("../../../entity/product-variant/product-variant.entity");
const product_price_applicator_1 = require("../product-price-applicator/product-price-applicator");
const translator_service_1 = require("../translator/translator.service");
const tree_relations_qb_joiner_1 = require("../utils/tree-relations-qb-joiner");
const merge_deep_1 = require("./merge-deep");
/**
 * @description
 * This is a helper class which is used to "hydrate" entity instances, which means to populate them
 * with the specified relations. This is useful when writing plugin code which receives an entity,
 * and you need to ensure that one or more relations are present.
 *
 * @example
 * ```ts
 * import { Injectable } from '\@nestjs/common';
 * import { ID, RequestContext, EntityHydrator, ProductVariantService } from '\@vendure/core';
 *
 * \@Injectable()
 * export class MyService {
 *
 *   constructor(
 *      // highlight-next-line
 *      private entityHydrator: EntityHydrator,
 *      private productVariantService: ProductVariantService,
 *   ) {}
 *
 *   myMethod(ctx: RequestContext, variantId: ID) {
 *     const product = await this.productVariantService
 *       .getProductForVariant(ctx, variantId);
 *
 *     // at this stage, we don't know which of the Product relations
 *     // will be joined at runtime.
 *
 *     // highlight-start
 *     await this.entityHydrator
 *       .hydrate(ctx, product, { relations: ['facetValues.facet' ]});
 *
 *     // You can be sure now that the `facetValues` & `facetValues.facet` relations are populated
 *     // highlight-end
 *   }
 * }
 *```
 *
 * In this above example, the `product` instance will now have the `facetValues` relation
 * available, and those FacetValues will have their `facet` relations joined too.
 *
 * This `hydrate` method will _also_ automatically take care or translating any
 * translatable entities (e.g. Product, Collection, Facet), and if the `applyProductVariantPrices`
 * options is used (see {@link HydrateOptions}), any related ProductVariant will have the correct
 * Channel-specific prices applied to them.
 *
 * Custom field relations may also be hydrated:
 *
 * @example
 * ```ts
 * const customer = await this.customerService
 *   .findOne(ctx, id);
 *
 * await this.entityHydrator
 *   .hydrate(ctx, customer, { relations: ['customFields.avatar' ]});
 * ```
 *
 * @docsCategory data-access
 * @since 1.3.0
 */
let EntityHydrator = class EntityHydrator {
    constructor(connection, productPriceApplicator, translator) {
        this.connection = connection;
        this.productPriceApplicator = productPriceApplicator;
        this.translator = translator;
    }
    /**
     * @description
     * Hydrates (joins) the specified relations to the target entity instance. This method
     * mutates the `target` entity.
     *
     * @example
     * ```ts
     * await this.entityHydrator.hydrate(ctx, product, {
     *   relations: [
     *     'variants.stockMovements'
     *     'optionGroups.options',
     *     'featuredAsset',
     *   ],
     *   applyProductVariantPrices: true,
     * });
     * ```
     *
     * @since 1.3.0
     */
    async hydrate(ctx, target, options) {
        if (options.relations) {
            let missingRelations = this.getMissingRelations(target, options);
            if (options.applyProductVariantPrices === true) {
                const productVariantPriceRelations = this.getRequiredProductVariantRelations(target, missingRelations);
                missingRelations = (0, unique_1.unique)([...missingRelations, ...productVariantPriceRelations]);
            }
            if (missingRelations.length) {
                const hydratedQb = this.connection
                    .getRepository(ctx, target.constructor)
                    .createQueryBuilder(target.constructor.name);
                const joinedRelations = (0, tree_relations_qb_joiner_1.joinTreeRelationsDynamically)(hydratedQb, target.constructor, missingRelations);
                hydratedQb.setFindOptions({
                    relationLoadStrategy: 'query',
                    where: { id: target.id },
                    relations: missingRelations.filter(relationPath => !joinedRelations.has(relationPath)),
                });
                const hydrated = await hydratedQb.getOne();
                const propertiesToAdd = (0, unique_1.unique)(missingRelations.map(relation => relation.split('.')[0]));
                for (const prop of propertiesToAdd) {
                    target[prop] = (0, merge_deep_1.mergeDeep)(target[prop], hydrated[prop]);
                }
                const relationsWithEntities = missingRelations.map(relation => ({
                    entity: this.getRelationEntityAtPath(target, relation.split('.')),
                    relation,
                }));
                if (options.applyProductVariantPrices === true) {
                    for (const relationWithEntities of relationsWithEntities) {
                        const entity = relationWithEntities.entity;
                        if (entity) {
                            if (Array.isArray(entity)) {
                                if (entity[0] instanceof product_variant_entity_1.ProductVariant) {
                                    await Promise.all(entity.map((e) => this.productPriceApplicator.applyChannelPriceAndTax(e, ctx)));
                                }
                            }
                            else {
                                if (entity instanceof product_variant_entity_1.ProductVariant) {
                                    await this.productPriceApplicator.applyChannelPriceAndTax(entity, ctx);
                                }
                            }
                        }
                    }
                }
                const translateDeepRelations = relationsWithEntities
                    .filter(item => this.isTranslatable(item.entity))
                    .map(item => item.relation.split('.'));
                this.assignSettableProperties(target, this.translator.translate(target, ctx, translateDeepRelations));
            }
        }
        return target;
    }
    assignSettableProperties(target, source) {
        for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(target))) {
            if (typeof descriptor.get === 'function' && typeof descriptor.set !== 'function') {
                // If the entity property has a getter only, we will skip it otherwise
                // we will get an error of the form:
                // `Cannot set property <name> of #<Entity> which has only a getter`
                continue;
            }
            target[key] = source[key];
        }
        return target;
    }
    /**
     * Compares the requested relations against the actual existing relations on the target entity,
     * and returns an array of all missing relation paths that would need to be fetched.
     */
    getMissingRelations(target, options) {
        const missingRelations = [];
        for (const relation of options.relations.slice().sort()) {
            if (typeof relation === 'string') {
                const parts = relation.split('.');
                let entity = target;
                const path = [];
                for (const part of parts) {
                    path.push(part);
                    // null = the relation has been fetched but was null in the database.
                    // undefined = the relation has not been fetched.
                    if (entity && entity[part] === null) {
                        break;
                    }
                    if (entity && entity[part]) {
                        entity = Array.isArray(entity[part]) ? entity[part][0] : entity[part];
                    }
                    else {
                        const allParts = path.reduce((result, p, i) => {
                            if (i === 0) {
                                return [p];
                            }
                            else {
                                return [...result, [result[result.length - 1], p].join('.')];
                            }
                        }, []);
                        missingRelations.push(...allParts);
                        entity = undefined;
                    }
                }
            }
        }
        return (0, unique_1.unique)(missingRelations.filter(relation => !relation.endsWith('.customFields')));
    }
    getRequiredProductVariantRelations(target, missingRelations) {
        const relationsToAdd = [];
        for (const relation of missingRelations) {
            const entityType = this.getRelationEntityTypeAtPath(target, relation);
            if (entityType === product_variant_entity_1.ProductVariant) {
                relationsToAdd.push([relation, 'taxCategory'].join('.'));
                relationsToAdd.push([relation, 'productVariantPrices'].join('.'));
            }
        }
        return relationsToAdd;
    }
    /**
     * Returns an instance of the related entity at the given path. E.g. a path of `['variants', 'featuredAsset']`
     * will return an Asset instance.
     */
    getRelationEntityAtPath(entity, path) {
        let isArrayResult = false;
        const result = [];
        function visit(parent, parts) {
            if (parts.length === 0) {
                return;
            }
            const part = parts.shift();
            const target = parent[part];
            if (Array.isArray(target)) {
                isArrayResult = true;
                if (parts.length === 0) {
                    result.push(...target);
                }
                else {
                    for (const item of target) {
                        visit(item, parts.slice());
                    }
                }
            }
            else if (target === null) {
                result.push(target);
            }
            else {
                if (parts.length === 0) {
                    result.push(target);
                }
                else {
                    visit(target, parts.slice());
                }
            }
        }
        visit(entity, path.slice());
        return isArrayResult ? result : result[0];
    }
    getRelationEntityTypeAtPath(entity, path) {
        const { entityMetadatas } = this.connection.rawConnection;
        const targetMetadata = entityMetadatas.find(m => m.target === entity.constructor);
        if (!targetMetadata) {
            throw new errors_1.InternalServerError(`Cannot find entity metadata for entity "${entity.constructor.name}"`);
        }
        let currentMetadata = targetMetadata;
        for (const pathPart of path.split('.')) {
            const relationMetadata = currentMetadata.findRelationWithPropertyPath(pathPart);
            if (relationMetadata) {
                currentMetadata = relationMetadata.inverseEntityMetadata;
            }
            else {
                throw new errors_1.InternalServerError(`Cannot find relation metadata for entity "${currentMetadata.targetName}" at path "${pathPart}"`);
            }
        }
        return currentMetadata.target;
    }
    isTranslatable(input) {
        var _a, _b, _c;
        return Array.isArray(input)
            ? (_b = (_a = input[0]) === null || _a === void 0 ? void 0 : _a.hasOwnProperty('translations')) !== null && _b !== void 0 ? _b : false
            : (_c = input === null || input === void 0 ? void 0 : input.hasOwnProperty('translations')) !== null && _c !== void 0 ? _c : false;
    }
};
exports.EntityHydrator = EntityHydrator;
exports.EntityHydrator = EntityHydrator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transactional_connection_1.TransactionalConnection,
        product_price_applicator_1.ProductPriceApplicator,
        translator_service_1.TranslatorService])
], EntityHydrator);
//# sourceMappingURL=entity-hydrator.service.js.map