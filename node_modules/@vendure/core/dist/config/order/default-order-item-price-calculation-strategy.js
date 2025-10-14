"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultOrderItemPriceCalculationStrategy = void 0;
/**
 * @description
 * The default {@link OrderItemPriceCalculationStrategy}, which simply passes through the price of
 * the ProductVariant without performing any calculations
 *
 * @docsCategory orders
 */
class DefaultOrderItemPriceCalculationStrategy {
    calculateUnitPrice(ctx, productVariant) {
        return {
            price: productVariant.listPrice,
            priceIncludesTax: productVariant.listPriceIncludesTax,
        };
    }
}
exports.DefaultOrderItemPriceCalculationStrategy = DefaultOrderItemPriceCalculationStrategy;
//# sourceMappingURL=default-order-item-price-calculation-strategy.js.map