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
exports.AdminFulltextSearchResolver = exports.ShopFulltextSearchResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const request_context_1 = require("../../../api/common/request-context");
const allow_decorator_1 = require("../../../api/decorators/allow.decorator");
const request_context_decorator_1 = require("../../../api/decorators/request-context.decorator");
const fulltext_search_service_1 = require("../fulltext-search.service");
const search_job_buffer_service_1 = require("../search-job-buffer/search-job-buffer.service");
let ShopFulltextSearchResolver = class ShopFulltextSearchResolver {
    constructor(fulltextSearchService) {
        this.fulltextSearchService = fulltextSearchService;
    }
    async search(ctx, args) {
        const result = await this.fulltextSearchService.search(ctx, args.input, true);
        // ensure the facetValues property resolver has access to the input args
        result.input = args.input;
        return result;
    }
    async facetValues(ctx, parent) {
        const facetValues = await this.fulltextSearchService.facetValues(ctx, parent.input, true);
        return facetValues.filter(i => !i.facetValue.facet.isPrivate);
    }
    async collections(ctx, parent) {
        const collections = await this.fulltextSearchService.collections(ctx, parent.input, true);
        return collections.filter(i => !i.collection.isPrivate);
    }
};
exports.ShopFulltextSearchResolver = ShopFulltextSearchResolver;
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.Public),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ShopFulltextSearchResolver.prototype, "search", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ShopFulltextSearchResolver.prototype, "facetValues", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ShopFulltextSearchResolver.prototype, "collections", null);
exports.ShopFulltextSearchResolver = ShopFulltextSearchResolver = __decorate([
    (0, graphql_1.Resolver)('SearchResponse'),
    __metadata("design:paramtypes", [fulltext_search_service_1.FulltextSearchService])
], ShopFulltextSearchResolver);
let AdminFulltextSearchResolver = class AdminFulltextSearchResolver {
    constructor(fulltextSearchService, searchJobBufferService) {
        this.fulltextSearchService = fulltextSearchService;
        this.searchJobBufferService = searchJobBufferService;
    }
    async search(ctx, args) {
        const result = await this.fulltextSearchService.search(ctx, args.input, false);
        // ensure the facetValues property resolver has access to the input args
        result.input = args.input;
        return result;
    }
    async facetValues(ctx, parent) {
        return this.fulltextSearchService.facetValues(ctx, parent.input, false);
    }
    async collections(ctx, parent) {
        return this.fulltextSearchService.collections(ctx, parent.input, false);
    }
    async reindex(ctx) {
        return this.fulltextSearchService.reindex(ctx);
    }
    async pendingSearchIndexUpdates(...args) {
        return this.searchJobBufferService.getPendingSearchUpdates();
    }
    async runPendingSearchIndexUpdates(...args) {
        // Intentionally not awaiting this method call
        void this.searchJobBufferService.runPendingSearchUpdates();
        return { success: true };
    }
};
exports.AdminFulltextSearchResolver = AdminFulltextSearchResolver;
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadCatalog, generated_types_1.Permission.ReadProduct),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], AdminFulltextSearchResolver.prototype, "search", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], AdminFulltextSearchResolver.prototype, "facetValues", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], AdminFulltextSearchResolver.prototype, "collections", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.UpdateCatalog, generated_types_1.Permission.UpdateProduct),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext]),
    __metadata("design:returntype", Promise)
], AdminFulltextSearchResolver.prototype, "reindex", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadCatalog, generated_types_1.Permission.ReadProduct),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminFulltextSearchResolver.prototype, "pendingSearchIndexUpdates", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.UpdateCatalog, generated_types_1.Permission.UpdateProduct),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminFulltextSearchResolver.prototype, "runPendingSearchIndexUpdates", null);
exports.AdminFulltextSearchResolver = AdminFulltextSearchResolver = __decorate([
    (0, graphql_1.Resolver)('SearchResponse'),
    __metadata("design:paramtypes", [fulltext_search_service_1.FulltextSearchService,
        search_job_buffer_service_1.SearchJobBufferService])
], AdminFulltextSearchResolver);
//# sourceMappingURL=fulltext-search.resolver.js.map