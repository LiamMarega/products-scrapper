import { RequestContext } from '../../api/common/request-context';
import { PriceCalculationResult } from '../../common/types/common-types';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { OrderItemPriceCalculationStrategy } from './order-item-price-calculation-strategy';
/**
 * @description
 * The default {@link OrderItemPriceCalculationStrategy}, which simply passes through the price of
 * the ProductVariant without performing any calculations
 *
 * @docsCategory orders
 */
export declare class DefaultOrderItemPriceCalculationStrategy implements OrderItemPriceCalculationStrategy {
    calculateUnitPrice(ctx: RequestContext, productVariant: ProductVariant): PriceCalculationResult | Promise<PriceCalculationResult>;
}
