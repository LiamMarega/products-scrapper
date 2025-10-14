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
exports.FacetEntityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const request_context_cache_service_1 = require("../../../cache/request-context-cache.service");
const facet_entity_1 = require("../../../entity/facet/facet.entity");
const facet_value_entity_1 = require("../../../entity/facet-value/facet-value.entity");
const locale_string_hydrator_1 = require("../../../service/helpers/locale-string-hydrator/locale-string-hydrator");
const facet_value_service_1 = require("../../../service/services/facet-value.service");
const request_context_1 = require("../../common/request-context");
const relations_decorator_1 = require("../../decorators/relations.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
let FacetEntityResolver = class FacetEntityResolver {
    constructor(facetValueService, localeStringHydrator, requestContextCache) {
        this.facetValueService = facetValueService;
        this.localeStringHydrator = localeStringHydrator;
        this.requestContextCache = requestContextCache;
    }
    name(ctx, facetValue) {
        return this.localeStringHydrator.hydrateLocaleStringField(ctx, facetValue, 'name');
    }
    languageCode(ctx, facetValue) {
        return this.localeStringHydrator.hydrateLocaleStringField(ctx, facetValue, 'languageCode');
    }
    async values(ctx, facet) {
        if (facet.values) {
            return facet.values;
        }
        return this.requestContextCache.get(ctx, `FacetEntityResolver.values(${facet.id})`, () => this.facetValueService.findByFacetId(ctx, facet.id));
    }
    async valueList(ctx, facet, args, relations) {
        return this.facetValueService.findByFacetIdList(ctx, facet.id, args.options, relations);
    }
};
exports.FacetEntityResolver = FacetEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, facet_value_entity_1.FacetValue]),
    __metadata("design:returntype", Promise)
], FacetEntityResolver.prototype, "name", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, facet_value_entity_1.FacetValue]),
    __metadata("design:returntype", Promise)
], FacetEntityResolver.prototype, "languageCode", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, facet_entity_1.Facet]),
    __metadata("design:returntype", Promise)
], FacetEntityResolver.prototype, "values", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __param(2, (0, graphql_1.Args)()),
    __param(3, (0, relations_decorator_1.Relations)({ entity: facet_value_entity_1.FacetValue })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext,
        facet_entity_1.Facet, Object, Array]),
    __metadata("design:returntype", Promise)
], FacetEntityResolver.prototype, "valueList", null);
exports.FacetEntityResolver = FacetEntityResolver = __decorate([
    (0, graphql_1.Resolver)('Facet'),
    __metadata("design:paramtypes", [facet_value_service_1.FacetValueService,
        locale_string_hydrator_1.LocaleStringHydrator,
        request_context_cache_service_1.RequestContextCacheService])
], FacetEntityResolver);
//# sourceMappingURL=facet-entity.resolver.js.map