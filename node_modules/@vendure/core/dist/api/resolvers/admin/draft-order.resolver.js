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
exports.DraftOrderResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const error_result_1 = require("../../../common/error/error-result");
const errors_1 = require("../../../common/error/errors");
const index_1 = require("../../../connection/index");
const customer_service_1 = require("../../../service/services/customer.service");
const order_service_1 = require("../../../service/services/order.service");
const request_context_1 = require("../../common/request-context");
const allow_decorator_1 = require("../../decorators/allow.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const transaction_decorator_1 = require("../../decorators/transaction.decorator");
let DraftOrderResolver = class DraftOrderResolver {
    constructor(orderService, customerService, connection) {
        this.orderService = orderService;
        this.customerService = customerService;
        this.connection = connection;
    }
    async createDraftOrder(ctx) {
        return this.orderService.createDraft(ctx);
    }
    async deleteDraftOrder(ctx, args) {
        const order = await this.orderService.findOne(ctx, args.orderId);
        if (!order || order.state !== 'Draft') {
            return {
                result: generated_types_1.DeletionResult.NOT_DELETED,
                message: `No draft Order with the ID ${args.orderId} was found`,
            };
        }
        try {
            await this.orderService.deleteOrder(ctx, args.orderId);
            return {
                result: generated_types_1.DeletionResult.DELETED,
            };
        }
        catch (e) {
            return {
                result: generated_types_1.DeletionResult.NOT_DELETED,
                message: e.message,
            };
        }
    }
    async addItemToDraftOrder(ctx, { orderId, input }) {
        return this.orderService.addItemToOrder(ctx, orderId, input.productVariantId, input.quantity, input.customFields);
    }
    async adjustDraftOrderLine(ctx, { orderId, input }) {
        if (input.quantity === 0) {
            return this.removeDraftOrderLine(ctx, { orderId, orderLineId: input.orderLineId });
        }
        return this.orderService.adjustOrderLine(ctx, orderId, input.orderLineId, input.quantity, input.customFields);
    }
    async removeDraftOrderLine(ctx, args) {
        return this.orderService.removeItemFromOrder(ctx, args.orderId, args.orderLineId);
    }
    async setDraftOrderCustomFields(ctx, args) {
        var _a;
        return this.orderService.updateCustomFields(ctx, args.orderId, (_a = args.input.customFields) !== null && _a !== void 0 ? _a : {});
    }
    async setCustomerForDraftOrder(ctx, args) {
        let customer;
        if (args.customerId) {
            const result = await this.customerService.findOne(ctx, args.customerId);
            if (!result) {
                throw new errors_1.UserInputError(`No customer with the id "${args.customerId}" was found in this Channel`);
            }
            customer = result;
        }
        else if (args.input) {
            const result = await this.customerService.createOrUpdate(ctx, args.input, true);
            if ((0, error_result_1.isGraphQlErrorResult)(result)) {
                return result;
            }
            customer = result;
        }
        else {
            throw new errors_1.UserInputError('Either "customerId" or "input" must be supplied to setCustomerForDraftOrder');
        }
        return this.orderService.addCustomerToOrder(ctx, args.orderId, customer);
    }
    async setDraftOrderShippingAddress(ctx, args) {
        return this.orderService.setShippingAddress(ctx, args.orderId, args.input);
    }
    async setDraftOrderBillingAddress(ctx, args) {
        return this.orderService.setBillingAddress(ctx, args.orderId, args.input);
    }
    async unsetDraftOrderShippingAddress(ctx, args) {
        return this.orderService.unsetShippingAddress(ctx, args.orderId);
    }
    async unsetDraftOrderBillingAddress(ctx, args) {
        return this.orderService.unsetBillingAddress(ctx, args.orderId);
    }
    async applyCouponCodeToDraftOrder(ctx, args) {
        return this.orderService.applyCouponCode(ctx, args.orderId, args.couponCode);
    }
    async removeCouponCodeFromDraftOrder(ctx, args) {
        return this.orderService.removeCouponCode(ctx, args.orderId, args.couponCode);
    }
    async eligibleShippingMethodsForDraftOrder(ctx, args) {
        return this.orderService.getEligibleShippingMethods(ctx, args.orderId);
    }
    async setDraftOrderShippingMethod(ctx, args) {
        return this.orderService.setShippingMethod(ctx, args.orderId, [args.shippingMethodId]);
    }
};
exports.DraftOrderResolver = DraftOrderResolver;
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateOrder),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext]),
    __metadata("design:returntype", Promise)
], DraftOrderResolver.prototype, "createDraftOrder", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.DeleteOrder),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], DraftOrderResolver.prototype, "deleteDraftOrder", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateOrder),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], DraftOrderResolver.prototype, "addItemToDraftOrder", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.UpdateOrder, generated_types_1.Permission.Owner),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], DraftOrderResolver.prototype, "adjustDraftOrderLine", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateOrder),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], DraftOrderResolver.prototype, "removeDraftOrderLine", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateOrder),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], DraftOrderResolver.prototype, "setDraftOrderCustomFields", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateOrder),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], DraftOrderResolver.prototype, "setCustomerForDraftOrder", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateOrder),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], DraftOrderResolver.prototype, "setDraftOrderShippingAddress", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateOrder),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], DraftOrderResolver.prototype, "setDraftOrderBillingAddress", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateOrder),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], DraftOrderResolver.prototype, "unsetDraftOrderShippingAddress", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateOrder),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], DraftOrderResolver.prototype, "unsetDraftOrderBillingAddress", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateOrder),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], DraftOrderResolver.prototype, "applyCouponCodeToDraftOrder", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateOrder),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], DraftOrderResolver.prototype, "removeCouponCodeFromDraftOrder", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateOrder),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], DraftOrderResolver.prototype, "eligibleShippingMethodsForDraftOrder", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateOrder),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], DraftOrderResolver.prototype, "setDraftOrderShippingMethod", null);
exports.DraftOrderResolver = DraftOrderResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [order_service_1.OrderService,
        customer_service_1.CustomerService,
        index_1.TransactionalConnection])
], DraftOrderResolver);
//# sourceMappingURL=draft-order.resolver.js.map