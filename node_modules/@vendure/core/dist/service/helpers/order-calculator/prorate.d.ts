/**
 * @description
 * "Prorate" means "to divide, distribute, or calculate proportionately."
 *
 * This function is used to distribute the `total` into parts proportional
 * to the `distribution` array. This is required to split up an Order-level
 * discount between OrderLines, and then between OrderItems in the line.
 *
 * Based on https://stackoverflow.com/a/12844927/772859
 */
export declare function prorate(weights: number[], amount: number): number[];
