"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultProductVariantPriceSelectionStrategy = void 0;
const utils_1 = require("../../common/utils");
/**
 * @description
 * The default strategy for selecting the price for a ProductVariant in a given Channel. It
 * first filters all available prices to those which are in the current Channel, and then
 * selects the first price which matches the current currency.
 *
 * @docsCategory configuration
 * @docsPage ProductVariantPriceSelectionStrategy
 * @since 2.0.0
 */
class DefaultProductVariantPriceSelectionStrategy {
    selectPrice(ctx, prices) {
        const pricesInChannel = prices.filter(p => (0, utils_1.idsAreEqual)(p.channelId, ctx.channelId));
        const priceInCurrency = pricesInChannel.find(p => p.currencyCode === ctx.currencyCode);
        return priceInCurrency;
    }
}
exports.DefaultProductVariantPriceSelectionStrategy = DefaultProductVariantPriceSelectionStrategy;
//# sourceMappingURL=default-product-variant-price-selection-strategy.js.map