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
exports.ShopPaymentMethodsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const payment_method_service_1 = require("../../../service/services/payment-method.service");
const request_context_1 = require("../../common/request-context");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
let ShopPaymentMethodsResolver = class ShopPaymentMethodsResolver {
    constructor(paymentMethodService) {
        this.paymentMethodService = paymentMethodService;
    }
    async activePaymentMethods(ctx) {
        return this.paymentMethodService.getActivePaymentMethods(ctx);
    }
};
exports.ShopPaymentMethodsResolver = ShopPaymentMethodsResolver;
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext]),
    __metadata("design:returntype", Promise)
], ShopPaymentMethodsResolver.prototype, "activePaymentMethods", null);
exports.ShopPaymentMethodsResolver = ShopPaymentMethodsResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [payment_method_service_1.PaymentMethodService])
], ShopPaymentMethodsResolver);
//# sourceMappingURL=shop-payment-methods.resolver.js.map