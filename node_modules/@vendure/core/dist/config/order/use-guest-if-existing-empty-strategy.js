"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseGuestIfExistingEmptyStrategy = void 0;
const order_merge_strategy_1 = require("./order-merge-strategy");
/**
 * @description
 * If the existing order is empty, then the guest order is used. Otherwise the existing order is used.
 *
 * @docsCategory orders
 * @docsPage Merge Strategies
 */
class UseGuestIfExistingEmptyStrategy {
    merge(ctx, guestOrder, existingOrder) {
        return existingOrder.lines.length
            ? existingOrder.lines.map(order_merge_strategy_1.toMergedOrderLine)
            : guestOrder.lines.map(order_merge_strategy_1.toMergedOrderLine);
    }
}
exports.UseGuestIfExistingEmptyStrategy = UseGuestIfExistingEmptyStrategy;
//# sourceMappingURL=use-guest-if-existing-empty-strategy.js.map