"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRefundProcess = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
let configService;
let historyService;
/**
 * @description
 * The default {@link RefundProcess}.
 *
 * @docsCategory payment
 */
exports.defaultRefundProcess = {
    transitions: {
        Pending: {
            to: ['Settled', 'Failed'],
        },
        Settled: {
            to: [],
        },
        Failed: {
            to: [],
        },
    },
    async init(injector) {
        const ConfigService = await import('../config.service.js').then(m => m.ConfigService);
        const HistoryService = await import('../../service/index.js').then(m => m.HistoryService);
        configService = injector.get(ConfigService);
        historyService = injector.get(HistoryService);
    },
    onTransitionStart: async (fromState, toState, data) => {
        return true;
    },
    onTransitionEnd: async (fromState, toState, data) => {
        if (!historyService) {
            throw new Error('HistoryService has not been initialized');
        }
        await historyService.createHistoryEntryForOrder({
            ctx: data.ctx,
            orderId: data.order.id,
            type: generated_types_1.HistoryEntryType.ORDER_REFUND_TRANSITION,
            data: {
                refundId: data.refund.id,
                from: fromState,
                to: toState,
                reason: data.refund.reason,
            },
        });
    },
};
//# sourceMappingURL=default-refund-process.js.map