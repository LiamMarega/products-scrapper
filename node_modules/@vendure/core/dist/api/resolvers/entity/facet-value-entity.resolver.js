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
exports.FacetValueEntityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const request_context_cache_service_1 = require("../../../cache/request-context-cache.service");
const facet_value_entity_1 = require("../../../entity/facet-value/facet-value.entity");
const locale_string_hydrator_1 = require("../../../service/helpers/locale-string-hydrator/locale-string-hydrator");
const facet_service_1 = require("../../../service/services/facet.service");
const request_context_1 = require("../../common/request-context");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
let FacetValueEntityResolver = class FacetValueEntityResolver {
    constructor(facetService, localeStringHydrator, requestContextCache) {
        this.facetService = facetService;
        this.localeStringHydrator = localeStringHydrator;
        this.requestContextCache = requestContextCache;
    }
    name(ctx, facetValue) {
        return this.localeStringHydrator.hydrateLocaleStringField(ctx, facetValue, 'name');
    }
    languageCode(ctx, facetValue) {
        return this.localeStringHydrator.hydrateLocaleStringField(ctx, facetValue, 'languageCode');
    }
    async facet(ctx, facetValue) {
        if (facetValue.facet) {
            return facetValue.facet;
        }
        return this.requestContextCache.get(ctx, `FacetValueEntityResolver.facet(${facetValue.id})`, () => this.facetService.findByFacetValueId(ctx, facetValue.id));
    }
};
exports.FacetValueEntityResolver = FacetValueEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, facet_value_entity_1.FacetValue]),
    __metadata("design:returntype", Promise)
], FacetValueEntityResolver.prototype, "name", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, facet_value_entity_1.FacetValue]),
    __metadata("design:returntype", Promise)
], FacetValueEntityResolver.prototype, "languageCode", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, facet_value_entity_1.FacetValue]),
    __metadata("design:returntype", Promise)
], FacetValueEntityResolver.prototype, "facet", null);
exports.FacetValueEntityResolver = FacetValueEntityResolver = __decorate([
    (0, graphql_1.Resolver)('FacetValue'),
    __metadata("design:paramtypes", [facet_service_1.FacetService,
        locale_string_hydrator_1.LocaleStringHydrator,
        request_context_cache_service_1.RequestContextCacheService])
], FacetValueEntityResolver);
//# sourceMappingURL=facet-value-entity.resolver.js.map