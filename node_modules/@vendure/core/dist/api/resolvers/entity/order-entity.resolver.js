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
exports.OrderAdminEntityResolver = exports.OrderEntityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const utils_1 = require("../../../common/utils");
const order_entity_1 = require("../../../entity/order/order.entity");
const index_1 = require("../../../service/index");
const history_service_1 = require("../../../service/services/history.service");
const order_service_1 = require("../../../service/services/order.service");
const request_context_1 = require("../../common/request-context");
const api_decorator_1 = require("../../decorators/api.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
let OrderEntityResolver = class OrderEntityResolver {
    constructor(orderService, customerService, historyService, translator) {
        this.orderService = orderService;
        this.customerService = customerService;
        this.historyService = historyService;
        this.translator = translator;
    }
    async payments(ctx, order) {
        if (order.payments) {
            return order.payments;
        }
        return this.orderService.getOrderPayments(ctx, order.id);
    }
    async fulfillments(ctx, order) {
        if (order.fulfillments) {
            return order.fulfillments;
        }
        return this.orderService.getOrderFulfillments(ctx, order);
    }
    async surcharges(ctx, order) {
        if (order.surcharges) {
            return order.surcharges;
        }
        return this.orderService.getOrderSurcharges(ctx, order.id);
    }
    async customer(ctx, order) {
        if (order.customer) {
            return order.customer;
        }
        if (order.customerId) {
            return this.customerService.findOne(ctx, order.customerId);
        }
    }
    async lines(ctx, order) {
        if (order.lines) {
            return order.lines;
        }
        const { lines } = await (0, utils_1.assertFound)(this.orderService.findOne(ctx, order.id));
        return lines;
    }
    async shippingLines(ctx, order) {
        if (order.shippingLines) {
            return order.shippingLines;
        }
        const { shippingLines } = await (0, utils_1.assertFound)(this.orderService.findOne(ctx, order.id, ['shippingLines.shippingMethod']));
        return shippingLines;
    }
    async history(ctx, apiType, order, args) {
        const publicOnly = apiType === 'shop';
        const options = Object.assign({}, args.options);
        if (!options.sort) {
            options.sort = { createdAt: generated_types_1.SortOrder.ASC };
        }
        return this.historyService.getHistoryForOrder(ctx, order.id, publicOnly, options);
    }
    async promotions(ctx, order) {
        // If the order has been hydrated with the promotions, then we can just return those
        // as long as they have the translations joined.
        if (order.promotions &&
            (order.promotions.length === 0 ||
                (order.promotions.length > 0 && order.promotions[0].translations))) {
            return order.promotions.map(p => this.translator.translate(p, ctx));
        }
        return this.orderService.getOrderPromotions(ctx, order.id);
    }
};
exports.OrderEntityResolver = OrderEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, order_entity_1.Order]),
    __metadata("design:returntype", Promise)
], OrderEntityResolver.prototype, "payments", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, order_entity_1.Order]),
    __metadata("design:returntype", Promise)
], OrderEntityResolver.prototype, "fulfillments", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, order_entity_1.Order]),
    __metadata("design:returntype", Promise)
], OrderEntityResolver.prototype, "surcharges", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, order_entity_1.Order]),
    __metadata("design:returntype", Promise)
], OrderEntityResolver.prototype, "customer", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, order_entity_1.Order]),
    __metadata("design:returntype", Promise)
], OrderEntityResolver.prototype, "lines", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, order_entity_1.Order]),
    __metadata("design:returntype", Promise)
], OrderEntityResolver.prototype, "shippingLines", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, api_decorator_1.Api)()),
    __param(2, (0, graphql_1.Parent)()),
    __param(3, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, String, order_entity_1.Order, Object]),
    __metadata("design:returntype", Promise)
], OrderEntityResolver.prototype, "history", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, order_entity_1.Order]),
    __metadata("design:returntype", Promise)
], OrderEntityResolver.prototype, "promotions", null);
exports.OrderEntityResolver = OrderEntityResolver = __decorate([
    (0, graphql_1.Resolver)('Order'),
    __metadata("design:paramtypes", [order_service_1.OrderService,
        index_1.CustomerService,
        history_service_1.HistoryService,
        index_1.TranslatorService])
], OrderEntityResolver);
let OrderAdminEntityResolver = class OrderAdminEntityResolver {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async channels(ctx, order) {
        var _a;
        const channels = (_a = order.channels) !== null && _a !== void 0 ? _a : (await this.orderService.getOrderChannels(ctx, order));
        return channels.filter(channel => { var _a, _b; return (_b = (_a = ctx.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.channelPermissions.find(cp => (0, utils_1.idsAreEqual)(cp.id, channel.id)); });
    }
    async modifications(ctx, order) {
        if (order.modifications) {
            return order.modifications;
        }
        return this.orderService.getOrderModifications(ctx, order.id);
    }
    async nextStates(order) {
        return this.orderService.getNextOrderStates(order);
    }
    async sellerOrders(ctx, order) {
        var _a, _b, _c;
        const sellerOrders = await this.orderService.getSellerOrders(ctx, order);
        // Only return seller orders on those channels to which the active user has access.
        const userChannelIds = (_c = (_b = (_a = ctx.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.channelPermissions.map(cp => cp.id)) !== null && _c !== void 0 ? _c : [];
        return sellerOrders.filter(sellerOrder => sellerOrder.channels.find(c => userChannelIds.includes(c.id)));
    }
    async aggregateOrder(ctx, order) {
        var _a, _b, _c;
        const aggregateOrder = await this.orderService.getAggregateOrder(ctx, order);
        const userChannelIds = (_c = (_b = (_a = ctx.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.channelPermissions.map(cp => cp.id)) !== null && _c !== void 0 ? _c : [];
        // Only return the aggregate order if the active user has permissions on that channel
        return aggregateOrder &&
            userChannelIds.find(id => aggregateOrder.channels.find(channel => (0, utils_1.idsAreEqual)(channel.id, id)))
            ? aggregateOrder
            : undefined;
    }
};
exports.OrderAdminEntityResolver = OrderAdminEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, order_entity_1.Order]),
    __metadata("design:returntype", Promise)
], OrderAdminEntityResolver.prototype, "channels", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, order_entity_1.Order]),
    __metadata("design:returntype", Promise)
], OrderAdminEntityResolver.prototype, "modifications", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_entity_1.Order]),
    __metadata("design:returntype", Promise)
], OrderAdminEntityResolver.prototype, "nextStates", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, order_entity_1.Order]),
    __metadata("design:returntype", Promise)
], OrderAdminEntityResolver.prototype, "sellerOrders", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, order_entity_1.Order]),
    __metadata("design:returntype", Promise)
], OrderAdminEntityResolver.prototype, "aggregateOrder", null);
exports.OrderAdminEntityResolver = OrderAdminEntityResolver = __decorate([
    (0, graphql_1.Resolver)('Order'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderAdminEntityResolver);
//# sourceMappingURL=order-entity.resolver.js.map