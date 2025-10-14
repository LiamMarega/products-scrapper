"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPaymentProcess = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const order_utils_1 = require("../../service/helpers/utils/order-utils");
let configService;
let orderService;
let historyService;
/**
 * @description
 * The default {@link PaymentProcess}
 *
 * @docsCategory payment
 */
exports.defaultPaymentProcess = {
    transitions: {
        Created: {
            to: ['Authorized', 'Settled', 'Declined', 'Error', 'Cancelled'],
        },
        Authorized: {
            to: ['Settled', 'Error', 'Cancelled'],
        },
        Settled: {
            to: ['Cancelled'],
        },
        Declined: {
            to: ['Cancelled'],
        },
        Error: {
            to: ['Cancelled'],
        },
        Cancelled: {
            to: [],
        },
    },
    async init(injector) {
        // Lazily import these services to avoid a circular dependency error
        // due to this being used as part of the DefaultConfig
        const ConfigService = await import('../config.service.js').then(m => m.ConfigService);
        const HistoryService = await import('../../service/index.js').then(m => m.HistoryService);
        const OrderService = await import('../../service/services/order.service.js').then(m => m.OrderService);
        configService = injector.get(ConfigService);
        historyService = injector.get(HistoryService);
        orderService = injector.get(OrderService);
    },
    async onTransitionStart(fromState, toState, data) {
        // nothing here by default
    },
    async onTransitionEnd(fromState, toState, data) {
        const { ctx, payment, order } = data;
        order.payments = await orderService.getOrderPayments(ctx, order.id);
        await historyService.createHistoryEntryForOrder({
            ctx: data.ctx,
            orderId: data.order.id,
            type: generated_types_1.HistoryEntryType.ORDER_PAYMENT_TRANSITION,
            data: {
                paymentId: data.payment.id,
                from: fromState,
                to: toState,
            },
        });
        if ((0, order_utils_1.orderTotalIsCovered)(order, 'Settled') &&
            order.state !== 'PaymentSettled' &&
            order.state !== 'ArrangingAdditionalPayment') {
            await orderService.transitionToState(ctx, order.id, 'PaymentSettled');
        }
        else if ((0, order_utils_1.orderTotalIsCovered)(order, ['Authorized', 'Settled']) &&
            order.state !== 'PaymentAuthorized' &&
            order.state !== 'ArrangingAdditionalPayment') {
            await orderService.transitionToState(ctx, order.id, 'PaymentAuthorized');
        }
    },
};
//# sourceMappingURL=default-payment-process.js.map