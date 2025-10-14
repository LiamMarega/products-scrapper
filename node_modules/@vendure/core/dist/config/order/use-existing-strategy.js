"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseExistingStrategy = void 0;
const order_merge_strategy_1 = require("./order-merge-strategy");
/**
 * @description
 * The guest order is discarded and the existing order is used as the active order.
 *
 * @docsCategory orders
 * @docsPage Merge Strategies
 */
class UseExistingStrategy {
    merge(ctx, guestOrder, existingOrder) {
        return existingOrder.lines.map(order_merge_strategy_1.toMergedOrderLine);
    }
}
exports.UseExistingStrategy = UseExistingStrategy;
//# sourceMappingURL=use-existing-strategy.js.map