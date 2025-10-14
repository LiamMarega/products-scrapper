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
exports.ProductPriceApplicator = void 0;
const common_1 = require("@nestjs/common");
const request_context_cache_service_1 = require("../../../cache/request-context-cache.service");
const constants_1 = require("../../../common/constants");
const errors_1 = require("../../../common/error/errors");
const config_service_1 = require("../../../config/config.service");
const tax_rate_service_1 = require("../../services/tax-rate.service");
const zone_service_1 = require("../../services/zone.service");
/**
 * @description
 * This helper is used to apply the correct price to a ProductVariant based on the current context
 * including active Channel, any current Order, etc. If you use the {@link TransactionalConnection} to
 * directly query ProductVariants, you will find that the `price` and `priceWithTax` properties will
 * always be `0` until you use the `applyChannelPriceAndTax()` method:
 *
 * @example
 * ```ts
 * export class MyCustomService {
 *   constructor(private connection: TransactionalConnection,
 *               private productPriceApplicator: ProductPriceApplicator) {}
 *
 *   getVariant(ctx: RequestContext, id: ID) {
 *     const productVariant = await this.connection
 *       .getRepository(ctx, ProductVariant)
 *       .findOne(id, { relations: ['taxCategory'] });
 *
 *     await this.productPriceApplicator
 *       .applyChannelPriceAndTax(productVariant, ctx);
 *
 *     return productVariant;
 *   }
 * }
 * ```
 *
 * @docsCategory service-helpers
 */
let ProductPriceApplicator = class ProductPriceApplicator {
    constructor(configService, taxRateService, zoneService, requestCache) {
        this.configService = configService;
        this.taxRateService = taxRateService;
        this.zoneService = zoneService;
        this.requestCache = requestCache;
    }
    /**
     * @description
     * Populates the `price` field with the price for the specified channel. Make sure that
     * the ProductVariant being passed in has its `taxCategory` relation joined.
     *
     * If the `throwIfNoPriceFound` option is set to `true`, then an error will be thrown if no
     * price is found for the given Channel.
     */
    async applyChannelPriceAndTax(variant, ctx, order, throwIfNoPriceFound = false) {
        var _a, _b;
        const { productVariantPriceSelectionStrategy, productVariantPriceCalculationStrategy } = this.configService.catalogOptions;
        const channelPrice = await productVariantPriceSelectionStrategy.selectPrice(ctx, variant.productVariantPrices);
        if (!channelPrice && throwIfNoPriceFound) {
            throw new errors_1.InternalServerError('error.no-price-found-for-channel', {
                variantId: variant.id,
                channel: ctx.channel.code,
            });
        }
        const { taxZoneStrategy } = this.configService.taxOptions;
        const zones = await this.requestCache.get(ctx, constants_1.CacheKey.AllZones, () => this.zoneService.getAllWithMembers(ctx));
        const activeTaxZone = await this.requestCache.get(ctx, constants_1.CacheKey.ActiveTaxZone_PPA, () => taxZoneStrategy.determineTaxZone(ctx, zones, ctx.channel, order));
        if (!activeTaxZone) {
            throw new errors_1.InternalServerError('error.no-active-tax-zone');
        }
        const applicableTaxRate = await this.requestCache.get(ctx, `applicableTaxRate-${activeTaxZone.id}-${variant.taxCategory.id}`, () => this.taxRateService.getApplicableTaxRate(ctx, activeTaxZone, variant.taxCategory));
        const { price, priceIncludesTax } = await productVariantPriceCalculationStrategy.calculate({
            inputPrice: (_a = channelPrice === null || channelPrice === void 0 ? void 0 : channelPrice.price) !== null && _a !== void 0 ? _a : 0,
            taxCategory: variant.taxCategory,
            productVariant: variant,
            activeTaxZone,
            ctx,
        });
        variant.listPrice = price;
        variant.listPriceIncludesTax = priceIncludesTax;
        variant.taxRateApplied = applicableTaxRate;
        variant.currencyCode = (_b = channelPrice === null || channelPrice === void 0 ? void 0 : channelPrice.currencyCode) !== null && _b !== void 0 ? _b : ctx.currencyCode;
        return variant;
    }
};
exports.ProductPriceApplicator = ProductPriceApplicator;
exports.ProductPriceApplicator = ProductPriceApplicator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService,
        tax_rate_service_1.TaxRateService,
        zone_service_1.ZoneService,
        request_context_cache_service_1.RequestContextCacheService])
], ProductPriceApplicator);
//# sourceMappingURL=product-price-applicator.js.map