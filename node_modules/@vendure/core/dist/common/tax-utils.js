"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taxComponentOf = taxComponentOf;
exports.netPriceOf = netPriceOf;
exports.taxPayableOn = taxPayableOn;
exports.grossPriceOf = grossPriceOf;
/**
 * Returns the tax component of a given gross price.
 */
function taxComponentOf(grossPrice, taxRatePc) {
    return grossPrice - grossPrice / ((100 + taxRatePc) / 100);
}
/**
 * Given a gross (tax-inclusive) price, returns the net price.
 */
function netPriceOf(grossPrice, taxRatePc) {
    return grossPrice - taxComponentOf(grossPrice, taxRatePc);
}
/**
 * Returns the tax applicable to the given net price.
 */
function taxPayableOn(netPrice, taxRatePc) {
    return netPrice * (taxRatePc / 100);
}
/**
 * Given a net price, return the gross price (net + tax)
 */
function grossPriceOf(netPrice, taxRatePc) {
    return netPrice + taxPayableOn(netPrice, taxRatePc);
}
//# sourceMappingURL=tax-utils.js.map