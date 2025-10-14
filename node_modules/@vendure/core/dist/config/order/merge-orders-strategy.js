"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeOrdersStrategy = void 0;
const order_merge_strategy_1 = require("./order-merge-strategy");
/**
 * @description
 * Merges both Orders. If the guest order contains items which are already in the
 * existing Order, the guest Order quantity will replace that of the existing Order.
 *
 * @docsCategory orders
 * @docsPage Merge Strategies
 */
class MergeOrdersStrategy {
    merge(ctx, guestOrder, existingOrder) {
        const mergedLines = existingOrder.lines.map(order_merge_strategy_1.toMergedOrderLine);
        const guestLines = guestOrder.lines.slice();
        for (const guestLine of guestLines.reverse()) {
            const existingLine = this.findCorrespondingLine(existingOrder, guestLine);
            if (!existingLine) {
                mergedLines.unshift((0, order_merge_strategy_1.toMergedOrderLine)(guestLine));
            }
            else {
                const matchingMergedLine = mergedLines.find(l => l.orderLineId === existingLine.id);
                if (matchingMergedLine) {
                    matchingMergedLine.quantity = guestLine.quantity;
                }
            }
        }
        return mergedLines;
    }
    findCorrespondingLine(existingOrder, guestLine) {
        return existingOrder.lines.find(line => line.productVariant.id === guestLine.productVariant.id &&
            JSON.stringify(line.customFields) === JSON.stringify(guestLine.customFields));
    }
}
exports.MergeOrdersStrategy = MergeOrdersStrategy;
//# sourceMappingURL=merge-orders-strategy.js.map