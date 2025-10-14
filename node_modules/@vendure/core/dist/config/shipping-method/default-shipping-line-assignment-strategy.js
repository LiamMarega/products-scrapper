"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultShippingLineAssignmentStrategy = void 0;
/**
 * @description
 * This is the default {@link ShippingLineAssignmentStrategy} which simply assigns all OrderLines to the
 * ShippingLine, and is suitable for the most common scenario of a single shipping method per Order.
 *
 * @since 2.0.0
 * @docsCategory shipping
 */
class DefaultShippingLineAssignmentStrategy {
    assignShippingLineToOrderLines(ctx, shippingLine, order) {
        return order.lines;
    }
}
exports.DefaultShippingLineAssignmentStrategy = DefaultShippingLineAssignmentStrategy;
//# sourceMappingURL=default-shipping-line-assignment-strategy.js.map