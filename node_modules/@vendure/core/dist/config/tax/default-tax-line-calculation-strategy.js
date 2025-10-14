"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultTaxLineCalculationStrategy = void 0;
/**
 * @description
 * The default {@link TaxLineCalculationStrategy} which applies a single TaxLine to the OrderLine
 * based on the applicable {@link TaxRate}.
 *
 * @docsCategory tax
 */
class DefaultTaxLineCalculationStrategy {
    calculate(args) {
        const { orderLine, applicableTaxRate } = args;
        return [applicableTaxRate.apply(orderLine.proratedUnitPrice)];
    }
}
exports.DefaultTaxLineCalculationStrategy = DefaultTaxLineCalculationStrategy;
//# sourceMappingURL=default-tax-line-calculation-strategy.js.map