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
exports.AssetEntityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const asset_entity_1 = require("../../../entity/asset/asset.entity");
const tag_service_1 = require("../../../service/services/tag.service");
const request_context_1 = require("../../common/request-context");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
let AssetEntityResolver = class AssetEntityResolver {
    constructor(tagService) {
        this.tagService = tagService;
    }
    async tags(ctx, asset) {
        if (asset.tags) {
            return asset.tags;
        }
        return this.tagService.getTagsForEntity(ctx, asset_entity_1.Asset, asset.id);
    }
};
exports.AssetEntityResolver = AssetEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, asset_entity_1.Asset]),
    __metadata("design:returntype", Promise)
], AssetEntityResolver.prototype, "tags", null);
exports.AssetEntityResolver = AssetEntityResolver = __decorate([
    (0, graphql_1.Resolver)('Asset'),
    __metadata("design:paramtypes", [tag_service_1.TagService])
], AssetEntityResolver);
//# sourceMappingURL=asset-entity.resolver.js.map