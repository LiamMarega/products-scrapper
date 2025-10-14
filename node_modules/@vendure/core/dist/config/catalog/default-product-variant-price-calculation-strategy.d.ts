import { Injector } from '../../common/injector';
import { PriceCalculationResult } from '../../common/types/common-types';
import { ProductVariantPriceCalculationArgs, ProductVariantPriceCalculationStrategy } from './product-variant-price-calculation-strategy';
/**
 * @description
 * A default ProductVariant price calculation function.
 *
 * @docsCategory products & stock
 */
export declare class DefaultProductVariantPriceCalculationStrategy implements ProductVariantPriceCalculationStrategy {
    private taxRateService;
    init(injector: Injector): void;
    calculate(args: ProductVariantPriceCalculationArgs): Promise<PriceCalculationResult>;
}
