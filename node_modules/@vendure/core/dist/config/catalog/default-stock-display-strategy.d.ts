import { RequestContext } from '../../api/common/request-context';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { StockDisplayStrategy } from './stock-display-strategy';
/**
 * @description
 * Displays the `ProductVariant.stockLevel` as either `'IN_STOCK'`, `'OUT_OF_STOCK'` or `'LOW_STOCK'`.
 * Low stock is defined as a saleable stock level less than or equal to the `lowStockLevel` as passed in
 * to the constructor (defaults to `2`).
 *
 * @docsCategory products & stock
 */
export declare class DefaultStockDisplayStrategy implements StockDisplayStrategy {
    private lowStockLevel;
    constructor(lowStockLevel?: number);
    getStockLevel(ctx: RequestContext, productVariant: ProductVariant, saleableStockLevel: number): string;
}
