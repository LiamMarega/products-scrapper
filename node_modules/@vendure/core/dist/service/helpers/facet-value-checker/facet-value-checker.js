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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacetValueChecker = void 0;
const common_1 = require("@nestjs/common");
const unique_1 = require("@vendure/common/lib/unique");
const ms_1 = __importDefault(require("ms"));
const operators_1 = require("rxjs/operators");
const cache_service_1 = require("../../../cache/cache.service");
const utils_1 = require("../../../common/utils");
const transactional_connection_1 = require("../../../connection/transactional-connection");
const product_variant_entity_1 = require("../../../entity/product-variant/product-variant.entity");
const index_1 = require("../../../event-bus/index");
/**
 * @description
 * The FacetValueChecker is a helper class used to determine whether a given OrderLine consists
 * of ProductVariants containing the given FacetValues.
 *
 * @example
 * ```ts
 * import { FacetValueChecker, LanguageCode, PromotionCondition, TransactionalConnection } from '\@vendure/core';
 *
 * let facetValueChecker: FacetValueChecker;
 *
 * export const hasFacetValues = new PromotionCondition({
 *   code: 'at_least_n_with_facets',
 *   description: [
 *     { languageCode: LanguageCode.en, value: 'Buy at least { minimum } products with the given facets' },
 *   ],
 *   args: {
 *     minimum: { type: 'int' },
 *     facets: { type: 'ID', list: true, ui: { component: 'facet-value-form-input' } },
 *   },
 *   init(injector) {
 *     facetValueChecker = injector.get(FacetValueChecker);
 *   },
 *   async check(ctx, order, args) {
 *     let matches = 0;
 *     for (const line of order.lines) {
 *       if (await facetValueChecker.hasFacetValues(line, args.facets)) {
 *           matches += line.quantity;
 *       }
 *     }
 *     return args.minimum <= matches;
 *   },
 * });
 * ```
 *
 * @docsCategory Promotions
 */
let FacetValueChecker = class FacetValueChecker {
    /**
     * @deprecated
     * Do not directly instantiate. Use the injector to get an instance:
     *
     * ```ts
     * facetValueChecker = injector.get(FacetValueChecker);
     * ```
     * @param connection
     */
    constructor(connection, cacheService, eventBus) {
        this.connection = connection;
        this.cacheService = cacheService;
        this.eventBus = eventBus;
        this.facetValueCache = this.cacheService.createCache({
            getKey: (variantId) => `FacetValueChecker.${variantId}`,
            options: { ttl: (0, ms_1.default)('1w') },
        });
    }
    onModuleInit() {
        var _a, _b;
        (_a = this.eventBus) === null || _a === void 0 ? void 0 : _a.ofType(index_1.ProductEvent).pipe((0, operators_1.filter)(event => event.type === 'updated')).subscribe(async (event) => {
            var _a;
            if ((_a = event.input) === null || _a === void 0 ? void 0 : _a.facetValueIds) {
                const variantIds = await this.connection.rawConnection
                    .getRepository(product_variant_entity_1.ProductVariant)
                    .createQueryBuilder('variant')
                    .select('variant.id', 'id')
                    .where('variant.productId = :prodId', { prodId: event.product.id })
                    .getRawMany()
                    .then(result => result.map(r => r.id));
                if (variantIds.length) {
                    await this.facetValueCache.delete(variantIds);
                }
            }
        });
        (_b = this.eventBus) === null || _b === void 0 ? void 0 : _b.ofType(index_1.ProductVariantEvent).pipe((0, operators_1.filter)(event => event.type === 'updated')).subscribe(async (event) => {
            const updatedVariantIds = [];
            if (Array.isArray(event.input)) {
                for (const input of event.input) {
                    if (input === null || input === void 0 ? void 0 : input.facetValueIds) {
                        updatedVariantIds.push(input.id);
                    }
                }
            }
            if (updatedVariantIds.length) {
                await this.facetValueCache.delete(updatedVariantIds);
            }
        });
    }
    /**
     * @description
     * Checks a given {@link OrderLine} against the facetValueIds and returns
     * `true` if the associated {@link ProductVariant} & {@link Product} together
     * have *all* the specified {@link FacetValue}s.
     */
    async hasFacetValues(orderLine, facetValueIds, ctx) {
        const variantId = orderLine.productVariant.id;
        const variantFacetValueIds = await this.facetValueCache.get(variantId, async () => {
            const variant = await this.connection
                .getRepository(ctx, product_variant_entity_1.ProductVariant)
                .findOne({
                where: { id: orderLine.productVariant.id },
                relations: ['product', 'product.facetValues', 'facetValues'],
                loadEagerRelations: false,
            })
                .then(result => result !== null && result !== void 0 ? result : undefined);
            if (!variant) {
                return [];
            }
            else {
                return (0, unique_1.unique)([...variant.facetValues, ...variant.product.facetValues].map(fv => fv.id));
            }
        });
        return facetValueIds.reduce((result, id) => result && !!(variantFacetValueIds !== null && variantFacetValueIds !== void 0 ? variantFacetValueIds : []).find(_id => (0, utils_1.idsAreEqual)(_id, id)), true);
    }
};
exports.FacetValueChecker = FacetValueChecker;
exports.FacetValueChecker = FacetValueChecker = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transactional_connection_1.TransactionalConnection,
        cache_service_1.CacheService,
        index_1.EventBus])
], FacetValueChecker);
//# sourceMappingURL=facet-value-checker.js.map