"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultStockAllocationStrategy = void 0;
/**
 * @description
 * Allocates stock when the Order transitions from `ArrangingPayment` to either
 * `PaymentAuthorized` or `PaymentSettled`.
 *
 * @docsCategory orders
 */
class DefaultStockAllocationStrategy {
    shouldAllocateStock(ctx, fromState, toState, order) {
        return (fromState === 'ArrangingPayment' &&
            (toState === 'PaymentAuthorized' || toState === 'PaymentSettled'));
    }
}
exports.DefaultStockAllocationStrategy = DefaultStockAllocationStrategy;
//# sourceMappingURL=default-stock-allocation-strategy.js.map