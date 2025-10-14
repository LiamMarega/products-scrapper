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
exports.ShopProductsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const errors_1 = require("../../../common/error/errors");
const collection_entity_1 = require("../../../entity/collection/collection.entity");
const facet_entity_1 = require("../../../entity/facet/facet.entity");
const product_entity_1 = require("../../../entity/product/product.entity");
const service_1 = require("../../../service");
const facet_value_service_1 = require("../../../service/services/facet-value.service");
const product_variant_service_1 = require("../../../service/services/product-variant.service");
const product_service_1 = require("../../../service/services/product.service");
const request_context_1 = require("../../common/request-context");
const relations_decorator_1 = require("../../decorators/relations.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
let ShopProductsResolver = class ShopProductsResolver {
    constructor(productService, productVariantService, facetValueService, collectionService, facetService) {
        this.productService = productService;
        this.productVariantService = productVariantService;
        this.facetValueService = facetValueService;
        this.collectionService = collectionService;
        this.facetService = facetService;
    }
    async products(ctx, args, relations) {
        const options = Object.assign(Object.assign({}, args.options), { filter: Object.assign(Object.assign({}, (args.options && args.options.filter)), { enabled: { eq: true } }) });
        return this.productService.findAll(ctx, options, relations);
    }
    async product(ctx, args, relations) {
        var _a;
        let result;
        if (args.id) {
            result = await this.productService.findOne(ctx, args.id, relations);
        }
        else if (args.slug) {
            result = await this.productService.findOneBySlug(ctx, args.slug, relations);
        }
        else {
            throw new errors_1.UserInputError('error.product-id-or-slug-must-be-provided');
        }
        if (!result) {
            return;
        }
        if (result.enabled === false) {
            return;
        }
        result.facetValues = (_a = result.facetValues) === null || _a === void 0 ? void 0 : _a.filter(fv => !fv.facet.isPrivate);
        return result;
    }
    async collections(ctx, args, relations) {
        const options = Object.assign(Object.assign({}, args.options), { filter: Object.assign(Object.assign({}, (args.options && args.options.filter)), { isPrivate: { eq: false } }) });
        return this.collectionService.findAll(ctx, options || undefined, relations);
    }
    async collection(ctx, args, relations) {
        let collection;
        if (args.id) {
            collection = await this.collectionService.findOne(ctx, args.id, relations);
            if (args.slug && collection && collection.slug !== args.slug) {
                throw new errors_1.UserInputError('error.collection-id-slug-mismatch');
            }
        }
        else if (args.slug) {
            collection = await this.collectionService.findOneBySlug(ctx, args.slug, relations);
        }
        else {
            throw new errors_1.UserInputError('error.collection-id-or-slug-must-be-provided');
        }
        if (collection && collection.isPrivate) {
            return;
        }
        return collection;
    }
    async search(...args) {
        throw new errors_1.InternalServerError('error.no-search-plugin-configured');
    }
    async facets(ctx, args, relations) {
        const options = Object.assign(Object.assign({}, args.options), { filter: Object.assign(Object.assign({}, (args.options && args.options.filter)), { isPrivate: { eq: false } }) });
        return this.facetService.findAll(ctx, options || undefined, relations);
    }
    async facet(ctx, args, relations) {
        const facet = await this.facetService.findOne(ctx, args.id, relations);
        if (facet && facet.isPrivate) {
            return;
        }
        return facet;
    }
};
exports.ShopProductsResolver = ShopProductsResolver;
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __param(2, (0, relations_decorator_1.Relations)({ entity: product_entity_1.Product, omit: ['variants', 'assets'] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object, Array]),
    __metadata("design:returntype", Promise)
], ShopProductsResolver.prototype, "products", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __param(2, (0, relations_decorator_1.Relations)({ entity: product_entity_1.Product, omit: ['variants', 'assets'] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object, Array]),
    __metadata("design:returntype", Promise)
], ShopProductsResolver.prototype, "product", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __param(2, (0, relations_decorator_1.Relations)({
        entity: collection_entity_1.Collection,
        omit: ['productVariants', 'assets', 'parent.productVariants', 'children.productVariants'],
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object, Array]),
    __metadata("design:returntype", Promise)
], ShopProductsResolver.prototype, "collections", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __param(2, (0, relations_decorator_1.Relations)({
        entity: collection_entity_1.Collection,
        omit: ['productVariants', 'assets', 'parent.productVariants', 'children.productVariants'],
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object, Array]),
    __metadata("design:returntype", Promise)
], ShopProductsResolver.prototype, "collection", null);
__decorate([
    (0, graphql_1.Query)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShopProductsResolver.prototype, "search", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __param(2, (0, relations_decorator_1.Relations)(facet_entity_1.Facet)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object, Array]),
    __metadata("design:returntype", Promise)
], ShopProductsResolver.prototype, "facets", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __param(2, (0, relations_decorator_1.Relations)(facet_entity_1.Facet)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object, Array]),
    __metadata("design:returntype", Promise)
], ShopProductsResolver.prototype, "facet", null);
exports.ShopProductsResolver = ShopProductsResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [product_service_1.ProductService,
        product_variant_service_1.ProductVariantService,
        facet_value_service_1.FacetValueService,
        service_1.CollectionService,
        service_1.FacetService])
], ShopProductsResolver);
//# sourceMappingURL=shop-products.resolver.js.map