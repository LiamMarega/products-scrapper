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
exports.ShopCustomerResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const errors_1 = require("../../../common/error/errors");
const utils_1 = require("../../../common/utils");
const customer_service_1 = require("../../../service/services/customer.service");
const request_context_1 = require("../../common/request-context");
const allow_decorator_1 = require("../../decorators/allow.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const transaction_decorator_1 = require("../../decorators/transaction.decorator");
let ShopCustomerResolver = class ShopCustomerResolver {
    constructor(customerService) {
        this.customerService = customerService;
    }
    async activeCustomer(ctx) {
        const userId = ctx.activeUserId;
        if (userId) {
            return this.customerService.findOneByUserId(ctx, userId);
        }
    }
    async updateCustomer(ctx, args) {
        const customer = await this.getCustomerForOwner(ctx);
        return this.customerService.update(ctx, Object.assign({ id: customer.id }, args.input));
    }
    async createCustomerAddress(ctx, args) {
        const customer = await this.getCustomerForOwner(ctx);
        return this.customerService.createAddress(ctx, customer.id, args.input);
    }
    async updateCustomerAddress(ctx, args) {
        const customer = await this.getCustomerForOwner(ctx);
        const customerAddresses = await this.customerService.findAddressesByCustomerId(ctx, customer.id);
        if (!customerAddresses.find(address => (0, utils_1.idsAreEqual)(address.id, args.input.id))) {
            throw new errors_1.ForbiddenError();
        }
        return this.customerService.updateAddress(ctx, args.input);
    }
    async deleteCustomerAddress(ctx, args) {
        const customer = await this.getCustomerForOwner(ctx);
        const customerAddresses = await this.customerService.findAddressesByCustomerId(ctx, customer.id);
        if (!customerAddresses.find(address => (0, utils_1.idsAreEqual)(address.id, args.id))) {
            throw new errors_1.ForbiddenError();
        }
        const success = await this.customerService.deleteAddress(ctx, args.id);
        return { success };
    }
    /**
     * Returns the Customer entity associated with the current user.
     */
    async getCustomerForOwner(ctx) {
        const userId = ctx.activeUserId;
        if (!userId) {
            throw new errors_1.ForbiddenError();
        }
        const customer = await this.customerService.findOneByUserId(ctx, userId);
        if (!customer) {
            throw new errors_1.InternalServerError('error.no-customer-found-for-current-user');
        }
        return customer;
    }
};
exports.ShopCustomerResolver = ShopCustomerResolver;
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.Owner),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext]),
    __metadata("design:returntype", Promise)
], ShopCustomerResolver.prototype, "activeCustomer", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.Owner),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ShopCustomerResolver.prototype, "updateCustomer", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.Owner),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ShopCustomerResolver.prototype, "createCustomerAddress", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.Owner),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ShopCustomerResolver.prototype, "updateCustomerAddress", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.Owner),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ShopCustomerResolver.prototype, "deleteCustomerAddress", null);
exports.ShopCustomerResolver = ShopCustomerResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [customer_service_1.CustomerService])
], ShopCustomerResolver);
//# sourceMappingURL=shop-customer.resolver.js.map