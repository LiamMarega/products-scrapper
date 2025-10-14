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
exports.RefundLineEntityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const transactional_connection_1 = require("../../../connection/transactional-connection");
const order_line_entity_1 = require("../../../entity/order-line/order-line.entity");
const refund_line_entity_1 = require("../../../entity/order-line-reference/refund-line.entity");
const refund_entity_1 = require("../../../entity/refund/refund.entity");
const request_context_1 = require("../../common/request-context");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
let RefundLineEntityResolver = class RefundLineEntityResolver {
    constructor(connection) {
        this.connection = connection;
    }
    async orderLine(ctx, refundLine) {
        return await this.connection.getEntityOrThrow(ctx, order_line_entity_1.OrderLine, refundLine.orderLineId);
    }
    async refund(ctx, refundLine) {
        return this.connection.getEntityOrThrow(ctx, refund_entity_1.Refund, refundLine.refundId);
    }
};
exports.RefundLineEntityResolver = RefundLineEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, refund_line_entity_1.RefundLine]),
    __metadata("design:returntype", Promise)
], RefundLineEntityResolver.prototype, "orderLine", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, refund_line_entity_1.RefundLine]),
    __metadata("design:returntype", Promise)
], RefundLineEntityResolver.prototype, "refund", null);
exports.RefundLineEntityResolver = RefundLineEntityResolver = __decorate([
    (0, graphql_1.Resolver)('RefundLine'),
    __metadata("design:paramtypes", [transactional_connection_1.TransactionalConnection])
], RefundLineEntityResolver);
//# sourceMappingURL=refund-line-entity.resolver.js.map