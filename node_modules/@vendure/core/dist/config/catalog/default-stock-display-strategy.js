"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultStockDisplayStrategy = void 0;
/**
 * @description
 * Displays the `ProductVariant.stockLevel` as either `'IN_STOCK'`, `'OUT_OF_STOCK'` or `'LOW_STOCK'`.
 * Low stock is defined as a saleable stock level less than or equal to the `lowStockLevel` as passed in
 * to the constructor (defaults to `2`).
 *
 * @docsCategory products & stock
 */
class DefaultStockDisplayStrategy {
    constructor(lowStockLevel = 2) {
        this.lowStockLevel = lowStockLevel;
    }
    getStockLevel(ctx, productVariant, saleableStockLevel) {
        return saleableStockLevel < 1
            ? 'OUT_OF_STOCK'
            : saleableStockLevel <= this.lowStockLevel
                ? 'LOW_STOCK'
                : 'IN_STOCK';
    }
}
exports.DefaultStockDisplayStrategy = DefaultStockDisplayStrategy;
//# sourceMappingURL=default-stock-display-strategy.js.map