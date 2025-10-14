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
exports.SearchResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const errors_1 = require("../../../common/error/errors");
const allow_decorator_1 = require("../../decorators/allow.decorator");
let SearchResolver = class SearchResolver {
    async search(...args) {
        throw new errors_1.InternalServerError('error.no-search-plugin-configured');
    }
    async facetValues(...args) {
        throw new errors_1.InternalServerError('error.no-search-plugin-configured');
    }
    async collections(...args) {
        throw new errors_1.InternalServerError('error.no-search-plugin-configured');
    }
    async reindex(...args) {
        throw new errors_1.InternalServerError('error.no-search-plugin-configured');
    }
    async pendingSearchIndexUpdates(...args) {
        throw new errors_1.InternalServerError('error.no-search-plugin-configured');
    }
    async runPendingSearchIndexUpdates(...args) {
        throw new errors_1.InternalServerError('error.no-search-plugin-configured');
    }
};
exports.SearchResolver = SearchResolver;
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadCatalog, generated_types_1.Permission.ReadProduct),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SearchResolver.prototype, "search", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SearchResolver.prototype, "facetValues", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SearchResolver.prototype, "collections", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.UpdateCatalog, generated_types_1.Permission.UpdateProduct),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SearchResolver.prototype, "reindex", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadCatalog, generated_types_1.Permission.ReadProduct),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SearchResolver.prototype, "pendingSearchIndexUpdates", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.UpdateCatalog, generated_types_1.Permission.UpdateProduct),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SearchResolver.prototype, "runPendingSearchIndexUpdates", null);
exports.SearchResolver = SearchResolver = __decorate([
    (0, graphql_1.Resolver)()
], SearchResolver);
//# sourceMappingURL=search.resolver.js.map