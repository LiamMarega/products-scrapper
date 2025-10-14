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
exports.CustomFieldRelationResolverService = void 0;
const common_1 = require("@nestjs/common");
const FindOptionsUtils_1 = require("typeorm/find-options/FindOptionsUtils");
const transactional_connection_1 = require("../../connection/transactional-connection");
const product_variant_entity_1 = require("../../entity/product-variant/product-variant.entity");
const product_price_applicator_1 = require("../../service/helpers/product-price-applicator/product-price-applicator");
const translator_service_1 = require("../../service/helpers/translator/translator.service");
let CustomFieldRelationResolverService = class CustomFieldRelationResolverService {
    constructor(connection, productPriceApplicator, translator) {
        this.connection = connection;
        this.productPriceApplicator = productPriceApplicator;
        this.translator = translator;
    }
    /**
     * @description
     * Used to dynamically resolve related entities in custom fields. Based on the field
     * config, this method is able to query the correct entity or entities from the database
     * to be returned through the GraphQL API.
     */
    async resolveRelation(config) {
        const { ctx, entityId, entityName, fieldDef } = config;
        const subQb = this.connection
            .getRepository(ctx, entityName)
            .createQueryBuilder('entity')
            .leftJoin(`entity.customFields.${fieldDef.name}`, 'relationEntity')
            .select('relationEntity.id')
            .where('entity.id = :id');
        const qb = this.connection
            .getRepository(ctx, fieldDef.entity)
            .createQueryBuilder('relation')
            .where(`relation.id IN (${subQb.getQuery()})`)
            .setParameters({ id: entityId });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        FindOptionsUtils_1.FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias.metadata);
        const result = fieldDef.list ? await qb.getMany() : await qb.getOne();
        return await this.translateEntity(ctx, result, fieldDef);
    }
    async translateEntity(ctx, result, fieldDef) {
        if (result == null)
            return null;
        if (fieldDef.entity === product_variant_entity_1.ProductVariant) {
            if (Array.isArray(result)) {
                await Promise.all(result.map(r => this.applyVariantPrices(ctx, r)));
            }
            else {
                await this.applyVariantPrices(ctx, result);
            }
        }
        const translated = Array.isArray(result)
            ? result.map(r => (this.isTranslatable(r) ? this.translator.translate(r, ctx) : r))
            : this.isTranslatable(result)
                ? this.translator.translate(result, ctx)
                : result;
        return translated;
    }
    isTranslatable(input) {
        return typeof input === 'object' && input != null && input.hasOwnProperty('translations');
    }
    async applyVariantPrices(ctx, variant) {
        const taxCategory = await this.connection
            .getRepository(ctx, product_variant_entity_1.ProductVariant)
            .createQueryBuilder()
            .relation('taxCategory')
            .of(variant)
            .loadOne();
        variant.taxCategory = taxCategory;
        return this.productPriceApplicator.applyChannelPriceAndTax(variant, ctx);
    }
};
exports.CustomFieldRelationResolverService = CustomFieldRelationResolverService;
exports.CustomFieldRelationResolverService = CustomFieldRelationResolverService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transactional_connection_1.TransactionalConnection,
        product_price_applicator_1.ProductPriceApplicator,
        translator_service_1.TranslatorService])
], CustomFieldRelationResolverService);
//# sourceMappingURL=custom-field-relation-resolver.service.js.map