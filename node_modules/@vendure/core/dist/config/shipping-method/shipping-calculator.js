"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingCalculator = void 0;
const configurable_operation_1 = require("../../common/configurable-operation");
/**
 * @description
 * The ShippingCalculator is used by a {@link ShippingMethod} to calculate the price of shipping on a given {@link Order}.
 *
 * @example
 * ```ts
 * const flatRateCalculator = new ShippingCalculator({
 *   code: 'flat-rate-calculator',
 *   description: [{ languageCode: LanguageCode.en, value: 'Default Flat-Rate Shipping Calculator' }],
 *   args: {
 *     rate: {
 *       type: 'int',
 *       ui: { component: 'currency-form-input' },
 *     },
 *     taxRate: {
         type: 'int',
         ui: { component: 'number-form-input', suffix: '%' },
       },
 *   },
 *   calculate: (ctx, order, args) => {
 *     return {
 *       price: args.rate,
 *       taxRate: args.taxRate,
 *       priceIncludesTax: ctx.channel.pricesIncludeTax,
 *     };
 *   },
 * });
 * ```
 *
 * @docsCategory shipping
 * @docsPage ShippingCalculator
 */
class ShippingCalculator extends configurable_operation_1.ConfigurableOperationDef {
    constructor(config) {
        super(config);
        this.calculateFn = config.calculate;
    }
    /**
     * @description
     * Calculates the price of shipping for the given Order.
     *
     * @internal
     */
    calculate(ctx, order, args, method) {
        return this.calculateFn(ctx, order, this.argsArrayToHash(args), method);
    }
}
exports.ShippingCalculator = ShippingCalculator;
//# sourceMappingURL=shipping-calculator.js.map