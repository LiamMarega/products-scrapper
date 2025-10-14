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
exports.PaymentAdminEntityResolver = exports.PaymentEntityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const pick_1 = require("@vendure/common/lib/pick");
const request_context_cache_service_1 = require("../../../cache/request-context-cache.service");
const payment_entity_1 = require("../../../entity/payment/payment.entity");
const service_1 = require("../../../service");
const order_service_1 = require("../../../service/services/order.service");
const request_context_1 = require("../../common/request-context");
const api_decorator_1 = require("../../decorators/api.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
let PaymentEntityResolver = class PaymentEntityResolver {
    constructor(orderService, requestContextCache) {
        this.orderService = orderService;
        this.requestContextCache = requestContextCache;
    }
    async refunds(ctx, payment) {
        if (payment.refunds) {
            return payment.refunds;
        }
        else {
            return this.requestContextCache.get(ctx, `PaymentEntityResolver.refunds(${payment.id})`, () => this.orderService.getPaymentRefunds(ctx, payment.id));
        }
    }
    metadata(apiType, payment) {
        return apiType === 'admin' ? payment.metadata : (0, pick_1.pick)(payment.metadata, ['public']);
    }
};
exports.PaymentEntityResolver = PaymentEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, payment_entity_1.Payment]),
    __metadata("design:returntype", Promise)
], PaymentEntityResolver.prototype, "refunds", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, api_decorator_1.Api)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payment_entity_1.Payment]),
    __metadata("design:returntype", Object)
], PaymentEntityResolver.prototype, "metadata", null);
exports.PaymentEntityResolver = PaymentEntityResolver = __decorate([
    (0, graphql_1.Resolver)('Payment'),
    __metadata("design:paramtypes", [order_service_1.OrderService,
        request_context_cache_service_1.RequestContextCacheService])
], PaymentEntityResolver);
let PaymentAdminEntityResolver = class PaymentAdminEntityResolver {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async nextStates(payment) {
        return this.paymentService.getNextStates(payment);
    }
};
exports.PaymentAdminEntityResolver = PaymentAdminEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_entity_1.Payment]),
    __metadata("design:returntype", Promise)
], PaymentAdminEntityResolver.prototype, "nextStates", null);
exports.PaymentAdminEntityResolver = PaymentAdminEntityResolver = __decorate([
    (0, graphql_1.Resolver)('Payment'),
    __metadata("design:paramtypes", [service_1.PaymentService])
], PaymentAdminEntityResolver);
//# sourceMappingURL=payment-entity.resolver.js.map