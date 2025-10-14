"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMergedOrderLine = toMergedOrderLine;
function toMergedOrderLine(line) {
    return {
        orderLineId: line.id,
        quantity: line.quantity,
        customFields: line.customFields,
    };
}
//# sourceMappingURL=order-merge-strategy.js.map