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
exports.SellerResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const seller_service_1 = require("../../../service/services/seller.service");
const request_context_1 = require("../../common/request-context");
const allow_decorator_1 = require("../../decorators/allow.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const transaction_decorator_1 = require("../../decorators/transaction.decorator");
let SellerResolver = class SellerResolver {
    constructor(sellerService) {
        this.sellerService = sellerService;
    }
    async sellers(ctx, args) {
        return this.sellerService.findAll(ctx, args.options);
    }
    async seller(ctx, args) {
        return this.sellerService.findOne(ctx, args.id);
    }
    async createSeller(ctx, args) {
        return this.sellerService.create(ctx, args.input);
    }
    async updateSeller(ctx, args) {
        return this.sellerService.update(ctx, args.input);
    }
    async deleteSeller(ctx, args) {
        return this.sellerService.delete(ctx, args.id);
    }
    async deleteSellers(ctx, args) {
        return Promise.all(args.ids.map(id => this.sellerService.delete(ctx, id)));
    }
};
exports.SellerResolver = SellerResolver;
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadSeller),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], SellerResolver.prototype, "sellers", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadSeller),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], SellerResolver.prototype, "seller", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateSeller),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], SellerResolver.prototype, "createSeller", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.UpdateSeller),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], SellerResolver.prototype, "updateSeller", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.DeleteSeller),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], SellerResolver.prototype, "deleteSeller", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.DeleteSeller),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], SellerResolver.prototype, "deleteSellers", null);
exports.SellerResolver = SellerResolver = __decorate([
    (0, graphql_1.Resolver)('Seller'),
    __metadata("design:paramtypes", [seller_service_1.SellerService])
], SellerResolver);
//# sourceMappingURL=seller.resolver.js.map