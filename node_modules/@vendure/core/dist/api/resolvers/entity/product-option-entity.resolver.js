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
exports.ProductOptionEntityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const request_context_cache_service_1 = require("../../../cache/request-context-cache.service");
const utils_1 = require("../../../common/utils");
const product_option_entity_1 = require("../../../entity/product-option/product-option.entity");
const locale_string_hydrator_1 = require("../../../service/helpers/locale-string-hydrator/locale-string-hydrator");
const product_option_group_service_1 = require("../../../service/services/product-option-group.service");
const request_context_1 = require("../../common/request-context");
const allow_decorator_1 = require("../../decorators/allow.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
let ProductOptionEntityResolver = class ProductOptionEntityResolver {
    constructor(productOptionGroupService, localeStringHydrator, requestContextCache) {
        this.productOptionGroupService = productOptionGroupService;
        this.localeStringHydrator = localeStringHydrator;
        this.requestContextCache = requestContextCache;
    }
    name(ctx, productOption) {
        return this.localeStringHydrator.hydrateLocaleStringField(ctx, productOption, 'name');
    }
    languageCode(ctx, productOption) {
        return this.localeStringHydrator.hydrateLocaleStringField(ctx, productOption, 'languageCode');
    }
    async group(ctx, option) {
        if (option.group) {
            return option.group;
        }
        return this.requestContextCache.get(ctx, `ProductOptionEntityResolver.group(${option.groupId})`, () => (0, utils_1.assertFound)(this.productOptionGroupService.findOne(ctx, option.groupId, undefined, {
            includeSoftDeleted: true,
        })));
    }
};
exports.ProductOptionEntityResolver = ProductOptionEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, product_option_entity_1.ProductOption]),
    __metadata("design:returntype", Promise)
], ProductOptionEntityResolver.prototype, "name", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, product_option_entity_1.ProductOption]),
    __metadata("design:returntype", Promise)
], ProductOptionEntityResolver.prototype, "languageCode", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadCatalog, generated_types_1.Permission.Public, generated_types_1.Permission.ReadProduct),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ProductOptionEntityResolver.prototype, "group", null);
exports.ProductOptionEntityResolver = ProductOptionEntityResolver = __decorate([
    (0, graphql_1.Resolver)('ProductOption'),
    __metadata("design:paramtypes", [product_option_group_service_1.ProductOptionGroupService,
        locale_string_hydrator_1.LocaleStringHydrator,
        request_context_cache_service_1.RequestContextCacheService])
], ProductOptionEntityResolver);
//# sourceMappingURL=product-option-entity.resolver.js.map