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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSplitter = void 0;
const common_1 = require("@nestjs/common");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const pick_1 = require("@vendure/common/lib/pick");
const config_service_1 = require("../../../config/config.service");
const transactional_connection_1 = require("../../../connection/transactional-connection");
const channel_entity_1 = require("../../../entity/channel/channel.entity");
const order_entity_1 = require("../../../entity/order/order.entity");
const order_line_entity_1 = require("../../../entity/order-line/order-line.entity");
const shipping_line_entity_1 = require("../../../entity/shipping-line/shipping-line.entity");
const channel_service_1 = require("../../services/channel.service");
const order_service_1 = require("../../services/order.service");
let OrderSplitter = class OrderSplitter {
    constructor(connection, configService, channelService, orderService) {
        this.connection = connection;
        this.configService = configService;
        this.channelService = channelService;
        this.orderService = orderService;
    }
    async createSellerOrders(ctx, order) {
        var _a, _b;
        const { orderSellerStrategy } = this.configService.orderOptions;
        const partialOrders = await ((_a = orderSellerStrategy.splitOrder) === null || _a === void 0 ? void 0 : _a.call(orderSellerStrategy, ctx, order));
        if (!partialOrders || partialOrders.length === 0) {
            // No split is needed
            return [];
        }
        const defaultChannel = await this.channelService.getDefaultChannel(ctx);
        order.type = generated_types_1.OrderType.Aggregate;
        const sellerOrders = [];
        for (const partialOrder of partialOrders) {
            const lines = [];
            for (const line of partialOrder.lines) {
                lines.push(await this.duplicateOrderLine(ctx, line));
            }
            const shippingLines = [];
            for (const shippingLine of partialOrder.shippingLines) {
                const newShippingLine = await this.duplicateShippingLine(ctx, shippingLine);
                for (const line of lines) {
                    if (shippingLine.id === line.shippingLineId) {
                        line.shippingLineId = newShippingLine.id;
                        await this.connection.getRepository(ctx, order_line_entity_1.OrderLine).save(line);
                    }
                }
                shippingLines.push(newShippingLine);
            }
            const sellerOrder = await this.connection.getRepository(ctx, order_entity_1.Order).save(new order_entity_1.Order({
                type: generated_types_1.OrderType.Seller,
                aggregateOrderId: order.id,
                code: await this.configService.orderOptions.orderCodeStrategy.generate(ctx),
                active: false,
                orderPlacedAt: new Date(),
                customer: order.customer,
                channels: [new channel_entity_1.Channel({ id: partialOrder.channelId }), defaultChannel],
                state: partialOrder.state,
                lines,
                surcharges: [],
                shippingLines,
                couponCodes: order.couponCodes,
                modifications: [],
                shippingAddress: order.shippingAddress,
                billingAddress: order.billingAddress,
                subTotal: 0,
                subTotalWithTax: 0,
                currencyCode: order.currencyCode,
            }));
            await this.connection
                .getRepository(ctx, order_entity_1.Order)
                .createQueryBuilder()
                .relation('sellerOrders')
                .of(order)
                .add(sellerOrder);
            await this.orderService.applyPriceAdjustments(ctx, sellerOrder);
            sellerOrders.push(sellerOrder);
        }
        await ((_b = orderSellerStrategy.afterSellerOrdersCreated) === null || _b === void 0 ? void 0 : _b.call(orderSellerStrategy, ctx, order, sellerOrders));
        return order.sellerOrders;
    }
    async duplicateOrderLine(ctx, line) {
        const newLine = await this.connection.getRepository(ctx, order_line_entity_1.OrderLine).save(new order_line_entity_1.OrderLine(Object.assign({}, (0, pick_1.pick)(line, [
            'quantity',
            'productVariant',
            'productVariantId',
            'taxCategory',
            'taxCategoryId',
            'featuredAsset',
            'shippingLine',
            'shippingLineId',
            'customFields',
            'sellerChannel',
            'sellerChannelId',
            'initialListPrice',
            'listPrice',
            'listPriceIncludesTax',
            'adjustments',
            'taxLines',
            'orderPlacedQuantity',
        ]))));
        return newLine;
    }
    async duplicateShippingLine(ctx, shippingLine) {
        return await this.connection.getRepository(ctx, shipping_line_entity_1.ShippingLine).save(new shipping_line_entity_1.ShippingLine(Object.assign({}, (0, pick_1.pick)(shippingLine, [
            'shippingMethodId',
            'order',
            'listPrice',
            'listPriceIncludesTax',
            'adjustments',
            'taxLines',
        ]))));
    }
};
exports.OrderSplitter = OrderSplitter;
exports.OrderSplitter = OrderSplitter = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transactional_connection_1.TransactionalConnection,
        config_service_1.ConfigService,
        channel_service_1.ChannelService,
        order_service_1.OrderService])
], OrderSplitter);
//# sourceMappingURL=order-splitter.js.map