"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultActiveOrderStrategy = void 0;
const errors_1 = require("../../common/error/errors");
const transactional_connection_1 = require("../../connection/transactional-connection");
const order_entity_1 = require("../../entity/order/order.entity");
/**
 * @description
 * The default {@link ActiveOrderStrategy}, which uses the current {@link Session} to determine
 * the active Order, and requires no additional input in the Shop API since it is based on the
 * session which is part of the RequestContext.
 *
 * @since 1.9.0
 * @docsCategory orders
 */
class DefaultActiveOrderStrategy {
    async init(injector) {
        this.connection = injector.get(transactional_connection_1.TransactionalConnection);
        // Lazy import these dependencies to avoid a circular dependency issue in NestJS.
        const { OrderService } = await import('../../service/services/order.service.js');
        const { SessionService } = await import('../../service/services/session.service.js');
        this.orderService = injector.get(OrderService);
        this.sessionService = injector.get(SessionService);
    }
    createActiveOrder(ctx) {
        return this.orderService.create(ctx, ctx.activeUserId);
    }
    async determineActiveOrder(ctx) {
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
        }
        return order || undefined;
    }
}
exports.DefaultActiveOrderStrategy = DefaultActiveOrderStrategy;
//# sourceMappingURL=default-active-order-strategy.js.map