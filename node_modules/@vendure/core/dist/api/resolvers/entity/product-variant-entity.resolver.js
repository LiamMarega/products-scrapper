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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantAdminEntityResolver = exports.ProductVariantEntityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const shared_constants_1 = require("@vendure/common/lib/shared-constants");
const request_context_cache_service_1 = require("../../../cache/request-context-cache.service");
const utils_1 = require("../../../common/utils");
const product_variant_entity_1 = require("../../../entity/product-variant/product-variant.entity");
const locale_string_hydrator_1 = require("../../../service/helpers/locale-string-hydrator/locale-string-hydrator");
const asset_service_1 = require("../../../service/services/asset.service");
const product_variant_service_1 = require("../../../service/services/product-variant.service");
const stock_level_service_1 = require("../../../service/services/stock-level.service");
const stock_movement_service_1 = require("../../../service/services/stock-movement.service");
const request_context_1 = require("../../common/request-context");
const api_decorator_1 = require("../../decorators/api.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
let ProductVariantEntityResolver = class ProductVariantEntityResolver {
    constructor(productVariantService, assetService, localeStringHydrator, requestContextCache) {
        this.productVariantService = productVariantService;
        this.assetService = assetService;
        this.localeStringHydrator = localeStringHydrator;
        this.requestContextCache = requestContextCache;
    }
    async name(ctx, productVariant) {
        return this.localeStringHydrator.hydrateLocaleStringField(ctx, productVariant, 'name');
    }
    async languageCode(ctx, productVariant) {
        return this.localeStringHydrator.hydrateLocaleStringField(ctx, productVariant, 'languageCode');
    }
    async price(ctx, productVariant) {
        return this.productVariantService.hydratePriceFields(ctx, productVariant, 'price');
    }
    async priceWithTax(ctx, productVariant) {
        return this.productVariantService.hydratePriceFields(ctx, productVariant, 'priceWithTax');
    }
    async currencyCode(ctx, productVariant) {
        return this.productVariantService.hydratePriceFields(ctx, productVariant, 'currencyCode');
    }
    async taxRateApplied(ctx, productVariant) {
        return this.productVariantService.hydratePriceFields(ctx, productVariant, 'taxRateApplied');
    }
    async product(ctx, productVariant) {
        var _a;
        if ((_a = productVariant.product) === null || _a === void 0 ? void 0 : _a.name) {
            return productVariant.product;
        }
        return this.requestContextCache.get(ctx, `ProductVariantEntityResolver.product(${productVariant.productId})`, () => this.productVariantService.getProductForVariant(ctx, productVariant));
    }
    async assets(ctx, productVariant) {
        return this.assetService.getEntityAssets(ctx, productVariant);
    }
    async featuredAsset(ctx, productVariant) {
        if (productVariant.featuredAsset !== undefined) {
            return productVariant.featuredAsset;
        }
        return this.assetService.getFeaturedAsset(ctx, productVariant);
    }
    async options(ctx, productVariant) {
        if (productVariant.options) {
            return productVariant.options;
        }
        return this.productVariantService.getOptionsForVariant(ctx, productVariant.id);
    }
    async facetValues(ctx, productVariant, apiType) {
        var _a, _b, _c;
        if (((_a = productVariant.facetValues) === null || _a === void 0 ? void 0 : _a.length) === 0) {
            return [];
        }
        let facetValues;
        if ((_c = (_b = productVariant.facetValues) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.channels) {
            facetValues = productVariant.facetValues;
        }
        else {
            facetValues = await this.productVariantService.getFacetValuesForVariant(ctx, productVariant.id);
        }
        return facetValues.filter(fv => {
            if (!fv.channels.find(c => (0, utils_1.idsAreEqual)(c.id, ctx.channelId))) {
                return false;
            }
            if (apiType === 'shop' && fv.facet.isPrivate) {
                return false;
            }
            return true;
        });
    }
    async stockLevel(ctx, productVariant) {
        return this.productVariantService.getDisplayStockLevel(ctx, productVariant);
    }
};
exports.ProductVariantEntityResolver = ProductVariantEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, product_variant_entity_1.ProductVariant]),
    __metadata("design:returntype", Promise)
], ProductVariantEntityResolver.prototype, "name", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext,
        product_variant_entity_1.ProductVariant]),
    __metadata("design:returntype", Promise)
], ProductVariantEntityResolver.prototype, "languageCode", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, product_variant_entity_1.ProductVariant]),
    __metadata("design:returntype", Promise)
], ProductVariantEntityResolver.prototype, "price", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext,
        product_variant_entity_1.ProductVariant]),
    __metadata("design:returntype", Promise)
], ProductVariantEntityResolver.prototype, "priceWithTax", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext,
        product_variant_entity_1.ProductVariant]),
    __metadata("design:returntype", Promise)
], ProductVariantEntityResolver.prototype, "currencyCode", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext,
        product_variant_entity_1.ProductVariant]),
    __metadata("design:returntype", Promise)
], ProductVariantEntityResolver.prototype, "taxRateApplied", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext,
        product_variant_entity_1.ProductVariant]),
    __metadata("design:returntype", Promise)
], ProductVariantEntityResolver.prototype, "product", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext,
        product_variant_entity_1.ProductVariant]),
    __metadata("design:returntype", Promise)
], ProductVariantEntityResolver.prototype, "assets", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext,
        product_variant_entity_1.ProductVariant]),
    __metadata("design:returntype", Promise)
], ProductVariantEntityResolver.prototype, "featuredAsset", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext,
        product_variant_entity_1.ProductVariant]),
    __metadata("design:returntype", Promise)
], ProductVariantEntityResolver.prototype, "options", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __param(2, (0, api_decorator_1.Api)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext,
        product_variant_entity_1.ProductVariant, String]),
    __metadata("design:returntype", Promise)
], ProductVariantEntityResolver.prototype, "facetValues", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, product_variant_entity_1.ProductVariant]),
    __metadata("design:returntype", Promise)
], ProductVariantEntityResolver.prototype, "stockLevel", null);
exports.ProductVariantEntityResolver = ProductVariantEntityResolver = __decorate([
    (0, graphql_1.Resolver)('ProductVariant'),
    __metadata("design:paramtypes", [product_variant_service_1.ProductVariantService,
        asset_service_1.AssetService,
        locale_string_hydrator_1.LocaleStringHydrator,
        request_context_cache_service_1.RequestContextCacheService])
], ProductVariantEntityResolver);
let ProductVariantAdminEntityResolver = class ProductVariantAdminEntityResolver {
    constructor(productVariantService, stockMovementService, stockLevelService) {
        this.productVariantService = productVariantService;
        this.stockMovementService = stockMovementService;
        this.stockLevelService = stockLevelService;
    }
    async stockMovements(ctx, productVariant, args) {
        return this.stockMovementService.getStockMovementsByProductVariantId(ctx, productVariant.id, args.options);
    }
    async stockOnHand(ctx, productVariant) {
        const { stockOnHand } = await this.stockLevelService.getAvailableStock(ctx, productVariant.id);
        return stockOnHand;
    }
    async stockAllocated(ctx, productVariant, args) {
        const { stockAllocated } = await this.stockLevelService.getAvailableStock(ctx, productVariant.id);
        return stockAllocated;
    }
    async channels(ctx, productVariant) {
        const isDefaultChannel = ctx.channel.code === shared_constants_1.DEFAULT_CHANNEL_CODE;
        const channels = await this.productVariantService.getProductVariantChannels(ctx, productVariant.id);
        return channels.filter(channel => (isDefaultChannel ? true : (0, utils_1.idsAreEqual)(channel.id, ctx.channelId)));
    }
    async stockLevels(ctx, productVariant) {
        return this.stockLevelService.getStockLevelsForVariant(ctx, productVariant.id);
    }
    async prices(ctx, productVariant) {
        if (productVariant.productVariantPrices) {
            return productVariant.productVariantPrices.filter(pvp => (0, utils_1.idsAreEqual)(pvp.channelId, ctx.channelId));
        }
        return this.productVariantService.getProductVariantPrices(ctx, productVariant.id);
    }
};
exports.ProductVariantAdminEntityResolver = ProductVariantAdminEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __param(2, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext,
        product_variant_entity_1.ProductVariant, Object]),
    __metadata("design:returntype", Promise)
], ProductVariantAdminEntityResolver.prototype, "stockMovements", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, product_variant_entity_1.ProductVariant]),
    __metadata("design:returntype", Promise)
], ProductVariantAdminEntityResolver.prototype, "stockOnHand", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __param(2, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext,
        product_variant_entity_1.ProductVariant, Object]),
    __metadata("design:returntype", Promise)
], ProductVariantAdminEntityResolver.prototype, "stockAllocated", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, product_variant_entity_1.ProductVariant]),
    __metadata("design:returntype", Promise)
], ProductVariantAdminEntityResolver.prototype, "channels", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext,
        product_variant_entity_1.ProductVariant]),
    __metadata("design:returntype", Promise)
], ProductVariantAdminEntityResolver.prototype, "stockLevels", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext,
        product_variant_entity_1.ProductVariant]),
    __metadata("design:returntype", Promise)
], ProductVariantAdminEntityResolver.prototype, "prices", null);
exports.ProductVariantAdminEntityResolver = ProductVariantAdminEntityResolver = __decorate([
    (0, graphql_1.Resolver)('ProductVariant'),
    __metadata("design:paramtypes", [product_variant_service_1.ProductVariantService,
        stock_movement_service_1.StockMovementService,
        stock_level_service_1.StockLevelService])
], ProductVariantAdminEntityResolver);
//# sourceMappingURL=product-variant-entity.resolver.js.map