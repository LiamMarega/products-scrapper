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
exports.FulfillmentLineEntityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const transactional_connection_1 = require("../../../connection/transactional-connection");
const fulfillment_entity_1 = require("../../../entity/fulfillment/fulfillment.entity");
const order_line_entity_1 = require("../../../entity/order-line/order-line.entity");
const fulfillment_line_entity_1 = require("../../../entity/order-line-reference/fulfillment-line.entity");
const request_context_1 = require("../../common/request-context");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
let FulfillmentLineEntityResolver = class FulfillmentLineEntityResolver {
    constructor(connection) {
        this.connection = connection;
    }
    async orderLine(ctx, fulfillmentLine) {
        return this.connection
            .getRepository(ctx, order_line_entity_1.OrderLine)
            .findOne({ where: { id: fulfillmentLine.orderLineId } });
    }
    async fulfillment(ctx, fulfillmentLine) {
        return this.connection
            .getRepository(ctx, fulfillment_entity_1.Fulfillment)
            .findOne({ where: { id: fulfillmentLine.fulfillmentId } });
    }
};
exports.FulfillmentLineEntityResolver = FulfillmentLineEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, fulfillment_line_entity_1.FulfillmentLine]),
    __metadata("design:returntype", Promise)
], FulfillmentLineEntityResolver.prototype, "orderLine", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, fulfillment_line_entity_1.FulfillmentLine]),
    __metadata("design:returntype", Promise)
], FulfillmentLineEntityResolver.prototype, "fulfillment", null);
exports.FulfillmentLineEntityResolver = FulfillmentLineEntityResolver = __decorate([
    (0, graphql_1.Resolver)('FulfillmentLine'),
    __metadata("design:paramtypes", [transactional_connection_1.TransactionalConnection])
], FulfillmentLineEntityResolver);
//# sourceMappingURL=fulfillment-line-entity.resolver.js.map