/**
 * Returns the tax component of a given gross price.
 */
export declare function taxComponentOf(grossPrice: number, taxRatePc: number): number;
/**
 * Given a gross (tax-inclusive) price, returns the net price.
 */
export declare function netPriceOf(grossPrice: number, taxRatePc: number): number;
/**
 * Returns the tax applicable to the given net price.
 */
export declare function taxPayableOn(netPrice: number, taxRatePc: number): number;
/**
 * Given a net price, return the gross price (net + tax)
 */
export declare function grossPriceOf(netPrice: number, taxRatePc: number): number;
