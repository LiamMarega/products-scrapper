"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultChangedPriceHandlingStrategy = void 0;
/**
 * @description
 * The default {@link ChangedPriceHandlingStrategy} will always use the latest price when
 * updating existing OrderLines.
 */
class DefaultChangedPriceHandlingStrategy {
    handlePriceChange(ctx, current) {
        return current;
    }
}
exports.DefaultChangedPriceHandlingStrategy = DefaultChangedPriceHandlingStrategy;
//# sourceMappingURL=default-changed-price-handling-strategy.js.map