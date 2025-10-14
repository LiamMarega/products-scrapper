"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultProductVariantPriceUpdateStrategy = void 0;
/**
 * @description
 * The default {@link ProductVariantPriceUpdateStrategy} which by default will not update any other
 * prices when a price is created, updated or deleted.
 *
 * If the `syncPricesAcrossChannels` option is set to `true`, then when a price is updated in one Channel,
 * the price of the same currencyCode in other Channels will be updated to match.  Note that if there are different
 * tax settings across the channels, these will not be taken into account. To handle this
 * case, a custom strategy should be implemented.
 *
 * @example
 * ```ts
 * import { DefaultProductVariantPriceUpdateStrategy, VendureConfig } from '\@vendure/core';
 *
 * export const config: VendureConfig = {
 *   // ...
 *   catalogOptions: {
 *     // highlight-start
 *     productVariantPriceUpdateStrategy: new DefaultProductVariantPriceUpdateStrategy({
 *       syncPricesAcrossChannels: true,
 *     }),
 *     // highlight-end
 *   },
 *   // ...
 * };
 * ```
 *
 * @docsCategory configuration
 * @docsPage ProductVariantPriceUpdateStrategy
 * @since 2.2.0
 */
class DefaultProductVariantPriceUpdateStrategy {
    constructor(options) {
        this.options = options;
    }
    onPriceCreated(ctx, price) {
        return [];
    }
    onPriceUpdated(ctx, updatedPrice, prices) {
        if (this.options.syncPricesAcrossChannels) {
            return prices
                .filter(p => p.currencyCode === updatedPrice.currencyCode)
                .map(p => ({
                id: p.id,
                price: updatedPrice.price,
            }));
        }
        else {
            return [];
        }
    }
    onPriceDeleted(ctx, deletedPrice, prices) {
        return [];
    }
}
exports.DefaultProductVariantPriceUpdateStrategy = DefaultProductVariantPriceUpdateStrategy;
//# sourceMappingURL=default-product-variant-price-update-strategy.js.map