"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseGuestStrategy = void 0;
const order_merge_strategy_1 = require("./order-merge-strategy");
/**
 * @description
 * Any existing order is discarded and the guest order is set as the active order.
 *
 * @docsCategory orders
 * @docsPage Merge Strategies
 */
class UseGuestStrategy {
    merge(ctx, guestOrder, existingOrder) {
        return guestOrder.lines.map(order_merge_strategy_1.toMergedOrderLine);
    }
}
exports.UseGuestStrategy = UseGuestStrategy;
//# sourceMappingURL=use-guest-strategy.js.map