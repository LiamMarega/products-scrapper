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
exports.ProductOptionResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const product_option_group_entity_1 = require("../../../entity/product-option-group/product-option-group.entity");
const product_option_group_service_1 = require("../../../service/services/product-option-group.service");
const product_option_service_1 = require("../../../service/services/product-option.service");
const request_context_1 = require("../../common/request-context");
const allow_decorator_1 = require("../../decorators/allow.decorator");
const relations_decorator_1 = require("../../decorators/relations.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const transaction_decorator_1 = require("../../decorators/transaction.decorator");
let ProductOptionResolver = class ProductOptionResolver {
    constructor(productOptionGroupService, productOptionService) {
        this.productOptionGroupService = productOptionGroupService;
        this.productOptionService = productOptionService;
    }
    productOptionGroups(ctx, args, relations) {
        return this.productOptionGroupService.findAll(ctx, args.filterTerm || undefined);
    }
    productOptionGroup(ctx, args, relations) {
        return this.productOptionGroupService.findOne(ctx, args.id);
    }
    async createProductOptionGroup(ctx, args) {
        const { input } = args;
        const group = await this.productOptionGroupService.create(ctx, input);
        if (input.options && input.options.length) {
            for (const option of input.options) {
                const newOption = await this.productOptionService.create(ctx, group, option);
                group.options.push(newOption);
            }
        }
        return group;
    }
    async updateProductOptionGroup(ctx, args) {
        const { input } = args;
        return this.productOptionGroupService.update(ctx, input);
    }
    async createProductOption(ctx, args) {
        const { input } = args;
        return this.productOptionService.create(ctx, input.productOptionGroupId, input);
    }
    async updateProductOption(ctx, args) {
        const { input } = args;
        return this.productOptionService.update(ctx, input);
    }
    async deleteProductOption(ctx, { id }) {
        return this.productOptionService.delete(ctx, id);
    }
};
exports.ProductOptionResolver = ProductOptionResolver;
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadCatalog, generated_types_1.Permission.ReadProduct),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __param(2, (0, relations_decorator_1.Relations)(product_option_group_entity_1.ProductOptionGroup)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object, Array]),
    __metadata("design:returntype", Promise)
], ProductOptionResolver.prototype, "productOptionGroups", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadCatalog, generated_types_1.Permission.ReadProduct),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __param(2, (0, relations_decorator_1.Relations)(product_option_group_entity_1.ProductOptionGroup)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object, Array]),
    __metadata("design:returntype", Promise)
], ProductOptionResolver.prototype, "productOptionGroup", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateCatalog, generated_types_1.Permission.CreateProduct),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ProductOptionResolver.prototype, "createProductOptionGroup", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.UpdateCatalog, generated_types_1.Permission.UpdateProduct),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ProductOptionResolver.prototype, "updateProductOptionGroup", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateCatalog, generated_types_1.Permission.CreateProduct),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ProductOptionResolver.prototype, "createProductOption", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.UpdateCatalog, generated_types_1.Permission.UpdateProduct),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ProductOptionResolver.prototype, "updateProductOption", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.DeleteCatalog, generated_types_1.Permission.DeleteProduct),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ProductOptionResolver.prototype, "deleteProductOption", null);
exports.ProductOptionResolver = ProductOptionResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [product_option_group_service_1.ProductOptionGroupService,
        product_option_service_1.ProductOptionService])
], ProductOptionResolver);
//# sourceMappingURL=product-option.resolver.js.map