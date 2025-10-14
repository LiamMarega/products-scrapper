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
exports.CollectionResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const errors_1 = require("../../../common/error/errors");
const collection_filter_1 = require("../../../config/catalog/collection-filter");
const collection_entity_1 = require("../../../entity/collection/collection.entity");
const collection_service_1 = require("../../../service/services/collection.service");
const facet_value_service_1 = require("../../../service/services/facet-value.service");
const configurable_operation_codec_1 = require("../../common/configurable-operation-codec");
const request_context_1 = require("../../common/request-context");
const allow_decorator_1 = require("../../decorators/allow.decorator");
const relations_decorator_1 = require("../../decorators/relations.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const transaction_decorator_1 = require("../../decorators/transaction.decorator");
let CollectionResolver = class CollectionResolver {
    constructor(collectionService, facetValueService, configurableOperationCodec) {
        this.collectionService = collectionService;
        this.facetValueService = facetValueService;
        this.configurableOperationCodec = configurableOperationCodec;
    }
    async collectionFilters(ctx, args) {
        return this.collectionService.getAvailableFilters(ctx);
    }
    async collections(ctx, args, relations) {
        return this.collectionService.findAll(ctx, args.options || undefined, relations);
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
        return collection;
    }
    previewCollectionVariants(ctx, args) {
        this.configurableOperationCodec.decodeConfigurableOperationIds(collection_filter_1.CollectionFilter, args.input.filters);
        return this.collectionService.previewCollectionVariants(ctx, args.input, args.options || undefined);
    }
    async createCollection(ctx, args) {
        const { input } = args;
        this.configurableOperationCodec.decodeConfigurableOperationIds(collection_filter_1.CollectionFilter, input.filters);
        const collection = await this.collectionService.create(ctx, input);
        return collection;
    }
    async updateCollection(ctx, args) {
        const { input } = args;
        this.configurableOperationCodec.decodeConfigurableOperationIds(collection_filter_1.CollectionFilter, input.filters || []);
        return this.collectionService.update(ctx, input);
    }
    async moveCollection(ctx, args) {
        const { input } = args;
        return this.collectionService.move(ctx, input);
    }
    async deleteCollection(ctx, args) {
        return this.collectionService.delete(ctx, args.id);
    }
    async deleteCollections(ctx, args) {
        return Promise.all(args.ids.map(id => this.collectionService.delete(ctx, id)));
    }
    async assignCollectionsToChannel(ctx, args) {
        return await this.collectionService.assignCollectionsToChannel(ctx, args.input);
    }
    async removeCollectionsFromChannel(ctx, args) {
        return await this.collectionService.removeCollectionsFromChannel(ctx, args.input);
    }
};
exports.CollectionResolver = CollectionResolver;
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadCatalog, generated_types_1.Permission.ReadCollection),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], CollectionResolver.prototype, "collectionFilters", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadCatalog, generated_types_1.Permission.ReadCollection),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __param(2, (0, relations_decorator_1.Relations)({
        entity: collection_entity_1.Collection,
        omit: ['productVariants', 'assets', 'parent.productVariants', 'children.productVariants'],
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object, Array]),
    __metadata("design:returntype", Promise)
], CollectionResolver.prototype, "collections", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadCatalog, generated_types_1.Permission.ReadCollection),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __param(2, (0, relations_decorator_1.Relations)({
        entity: collection_entity_1.Collection,
        omit: ['productVariants', 'assets', 'parent.productVariants', 'children.productVariants'],
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object, Array]),
    __metadata("design:returntype", Promise)
], CollectionResolver.prototype, "collection", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadCatalog, generated_types_1.Permission.ReadCollection),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", void 0)
], CollectionResolver.prototype, "previewCollectionVariants", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateCatalog, generated_types_1.Permission.CreateCollection),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], CollectionResolver.prototype, "createCollection", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.UpdateCatalog, generated_types_1.Permission.UpdateCollection),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], CollectionResolver.prototype, "updateCollection", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.UpdateCatalog, generated_types_1.Permission.UpdateCollection),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], CollectionResolver.prototype, "moveCollection", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.DeleteCatalog, generated_types_1.Permission.DeleteCollection),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], CollectionResolver.prototype, "deleteCollection", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.DeleteCatalog, generated_types_1.Permission.DeleteCollection),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], CollectionResolver.prototype, "deleteCollections", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateCatalog, generated_types_1.Permission.CreateCollection),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], CollectionResolver.prototype, "assignCollectionsToChannel", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.DeleteCatalog, generated_types_1.Permission.DeleteCollection),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], CollectionResolver.prototype, "removeCollectionsFromChannel", null);
exports.CollectionResolver = CollectionResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [collection_service_1.CollectionService,
        facet_value_service_1.FacetValueService,
        configurable_operation_codec_1.ConfigurableOperationCodec])
], CollectionResolver);
//# sourceMappingURL=collection.resolver.js.map