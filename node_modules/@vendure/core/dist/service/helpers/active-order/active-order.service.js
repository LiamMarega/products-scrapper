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
exports.ActiveOrderService = void 0;
const common_1 = require("@nestjs/common");
const errors_1 = require("../../../common/error/errors");
const utils_1 = require("../../../common/utils");
const config_service_1 = require("../../../config/config.service");
const transactional_connection_1 = require("../../../connection/transactional-connection");
const order_entity_1 = require("../../../entity/order/order.entity");
const order_service_1 = require("../../services/order.service");
const session_service_1 = require("../../services/session.service");
/**
 * @description
 * This helper class is used to get a reference to the active Order from the current RequestContext.
 *
 * @docsCategory orders
 */
let ActiveOrderService = class ActiveOrderService {
    constructor(sessionService, orderService, connection, configService) {
        this.sessionService = sessionService;
        this.orderService = orderService;
        this.connection = connection;
        this.configService = configService;
    }
    async getOrderFromContext(ctx, createIfNotExists = false) {
        if (!ctx.session) {
            throw new errors_1.InternalServerError('error.no-active-session');
        }
        let order = ctx.session.activeOrderId
            ? await this.connection
                .getRepository(ctx, order_entity_1.Order)
                .createQueryBuilder('order')
                .leftJoin('order.channels', 'channel')
                .where('order.id = :orderId', { orderId: ctx.session.activeOrderId })
                .andWhere('channel.id = :channelId', { channelId: ctx.channelId })
                .getOne()
            : undefined;
        if (order && order.active === false) {
            // edge case where an inactive order may not have been
            // removed from the session, i.e. the regular process was interrupted
            await this.sessionService.unsetActiveOrder(ctx, ctx.session);
            order = undefined;
        }
        if (!order) {
            if (ctx.activeUserId) {
                order = await this.orderService.getActiveOrderForUser(ctx, ctx.activeUserId);
            }
            if (!order && createIfNotExists) {
                order = await this.orderService.create(ctx, ctx.activeUserId);
            }
            if (order) {
                await this.sessionService.setActiveOrder(ctx, ctx.session, order);
            }
        }
        return order || undefined;
    }
    async getActiveOrder(ctx, input, createIfNotExists = false) {
        var _a;
        let order;
        if (!order) {
            const { activeOrderStrategy } = this.configService.orderOptions;
            const strategyArray = Array.isArray(activeOrderStrategy)
                ? activeOrderStrategy
                : [activeOrderStrategy];
            for (const strategy of strategyArray) {
                const strategyInput = (_a = input === null || input === void 0 ? void 0 : input[strategy.name]) !== null && _a !== void 0 ? _a : {};
                order = await strategy.determineActiveOrder(ctx, strategyInput);
                if (order) {
                    break;
                }
                if (createIfNotExists && typeof strategy.createActiveOrder === 'function') {
                    order = await strategy.createActiveOrder(ctx, strategyInput);
                }
                if (order) {
                    break;
                }
            }
            if (!order && createIfNotExists) {
                // No order has been found, and none could be created, which indicates that
                // none of the configured strategies have a `createActiveOrder` method defined.
                // In this case, we should throw an error because it is assumed that such a configuration
                // indicates that an external order creation mechanism should be defined.
                throw new errors_1.UserInputError('error.order-could-not-be-determined-or-created');
            }
            if (order && ctx.session) {
                const orderAlreadyAssignedToSession = ctx.session.activeOrderId && (0, utils_1.idsAreEqual)(ctx.session.activeOrderId, order.id);
                if (!orderAlreadyAssignedToSession) {
                    await this.sessionService.setActiveOrder(ctx, ctx.session, order);
                }
            }
        }
        return order || undefined;
    }
};
exports.ActiveOrderService = ActiveOrderService;
exports.ActiveOrderService = ActiveOrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [session_service_1.SessionService,
        order_service_1.OrderService,
        transactional_connection_1.TransactionalConnection,
        config_service_1.ConfigService])
], ActiveOrderService);
//# sourceMappingURL=active-order.service.js.map