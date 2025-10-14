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
exports.RefundEntityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const utils_1 = require("../../../common/utils");
const refund_entity_1 = require("../../../entity/refund/refund.entity");
const payment_service_1 = require("../../../service/services/payment.service");
const request_context_1 = require("../../common/request-context");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
let RefundEntityResolver = class RefundEntityResolver {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async lines(ctx, refund) {
        var _a, _b;
        if (refund.lines) {
            return refund.lines;
        }
        const payment = await this.paymentService.findOneOrThrow(ctx, refund.paymentId, ['refunds.lines']);
        return (_b = (_a = payment.refunds.find(r => (0, utils_1.idsAreEqual)(r.id, refund.id))) === null || _a === void 0 ? void 0 : _a.lines) !== null && _b !== void 0 ? _b : [];
    }
};
exports.RefundEntityResolver = RefundEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, refund_entity_1.Refund]),
    __metadata("design:returntype", Promise)
], RefundEntityResolver.prototype, "lines", null);
exports.RefundEntityResolver = RefundEntityResolver = __decorate([
    (0, graphql_1.Resolver)('Refund'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], RefundEntityResolver);
//# sourceMappingURL=refund-entity.resolver.js.map