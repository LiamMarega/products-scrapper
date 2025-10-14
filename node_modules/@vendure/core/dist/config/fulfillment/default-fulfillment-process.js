"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultFulfillmentProcess = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const error_result_1 = require("../../common/error/error-result");
const errors_1 = require("../../common/error/errors");
const utils_1 = require("../../common/utils");
const order_entity_1 = require("../../entity/order/order.entity");
const order_utils_1 = require("../../service/helpers/utils/order-utils");
let connection;
let configService;
let orderService;
let historyService;
let stockMovementService;
let stockLevelService;
/**
 * @description
 * The default {@link FulfillmentProcess}. This process includes the following actions:
 *
 * - Executes the configured `FulfillmentHandler.onFulfillmentTransition()` before any state
 *   transition.
 * - On cancellation of a Fulfillment, creates the necessary {@link Cancellation} & {@link Allocation}
 *   stock movement records.
 * - When a Fulfillment transitions from the `Created` to `Pending` state, the necessary
 *   {@link Sale} stock movements are created.
 *
 * @docsCategory fulfillment
 * @docsPage FulfillmentProcess
 * @since 2.0.0
 */
exports.defaultFulfillmentProcess = {
    transitions: {
        Created: {
            to: ['Pending'],
        },
        Pending: {
            to: ['Shipped', 'Delivered', 'Cancelled'],
        },
        Shipped: {
            to: ['Delivered', 'Cancelled'],
        },
        Delivered: {
            to: ['Cancelled'],
        },
        Cancelled: {
            to: [],
        },
    },
    async init(injector) {
        // Lazily import these services to avoid a circular dependency error
        // due to this being used as part of the DefaultConfig
        const TransactionalConnection = await import('../../connection/transactional-connection.js').then(m => m.TransactionalConnection);
        const ConfigService = await import('../config.service.js').then(m => m.ConfigService);
        const HistoryService = await import('../../service/index.js').then(m => m.HistoryService);
        const OrderService = await import('../../service/index.js').then(m => m.OrderService);
        const StockMovementService = await import('../../service/index.js').then(m => m.StockMovementService);
        const StockLevelService = await import('../../service/index.js').then(m => m.StockLevelService);
        connection = injector.get(TransactionalConnection);
        configService = injector.get(ConfigService);
        orderService = injector.get(OrderService);
        historyService = injector.get(HistoryService);
        stockMovementService = injector.get(StockMovementService);
        stockLevelService = injector.get(StockLevelService);
    },
    async onTransitionStart(fromState, toState, data) {
        const { fulfillmentHandlers } = configService.shippingOptions;
        const fulfillmentHandler = fulfillmentHandlers.find(h => h.code === data.fulfillment.handlerCode);
        if (fulfillmentHandler) {
            const result = await (0, utils_1.awaitPromiseOrObservable)(fulfillmentHandler.onFulfillmentTransition(fromState, toState, data));
            if (result === false || typeof result === 'string') {
                return result;
            }
        }
    },
    async onTransitionEnd(fromState, toState, { ctx, fulfillment, orders }) {
        if (toState === 'Cancelled') {
            const orderLineInput = fulfillment.lines.map(l => ({
                orderLineId: l.orderLineId,
                quantity: l.quantity,
            }));
            await stockMovementService.createCancellationsForOrderLines(ctx, orderLineInput);
            await stockMovementService.createAllocationsForOrderLines(ctx, orderLineInput);
        }
        if (fromState === 'Created' && toState === 'Pending') {
            await stockMovementService.createSalesForOrder(ctx, fulfillment.lines);
        }
        const historyEntryPromises = orders.map(order => historyService.createHistoryEntryForOrder({
            orderId: order.id,
            type: generated_types_1.HistoryEntryType.ORDER_FULFILLMENT_TRANSITION,
            ctx,
            data: {
                fulfillmentId: fulfillment.id,
                from: fromState,
                to: toState,
            },
        }));
        await Promise.all(historyEntryPromises);
        await Promise.all(orders.map(order => handleFulfillmentStateTransitByOrder(ctx, order, fulfillment, fromState, toState)));
    },
};
async function handleFulfillmentStateTransitByOrder(ctx, order, fulfillment, fromState, toState) {
    const nextOrderStates = orderService.getNextOrderStates(order);
    const transitionOrderIfStateAvailable = async (state) => {
        if (nextOrderStates.includes(state)) {
            const result = await orderService.transitionToState(ctx, order.id, state);
            if ((0, error_result_1.isGraphQlErrorResult)(result)) {
                throw new errors_1.InternalServerError(result.message);
            }
        }
    };
    if (toState === 'Shipped') {
        const orderWithFulfillment = await getOrderWithFulfillments(ctx, order.id);
        if ((0, order_utils_1.orderItemsAreShipped)(orderWithFulfillment)) {
            await transitionOrderIfStateAvailable('Shipped');
        }
        else {
            await transitionOrderIfStateAvailable('PartiallyShipped');
        }
    }
    if (toState === 'Delivered') {
        const orderWithFulfillment = await getOrderWithFulfillments(ctx, order.id);
        if ((0, order_utils_1.orderItemsAreDelivered)(orderWithFulfillment)) {
            await transitionOrderIfStateAvailable('Delivered');
        }
        else {
            await transitionOrderIfStateAvailable('PartiallyDelivered');
        }
    }
}
async function getOrderWithFulfillments(ctx, orderId) {
    return await connection.getEntityOrThrow(ctx, order_entity_1.Order, orderId, {
        relations: ['lines', 'fulfillments', 'fulfillments.lines', 'fulfillments.lines.fulfillment'],
    });
}
//# sourceMappingURL=default-fulfillment-process.js.map