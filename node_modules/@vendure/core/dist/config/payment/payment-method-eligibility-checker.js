"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodEligibilityChecker = void 0;
const configurable_operation_1 = require("../../common/configurable-operation");
/**
 * @description
 * The PaymentMethodEligibilityChecker class is used to check whether an order qualifies for a
 * given {@link PaymentMethod}.
 *
 * @example
 * ```ts
 * const ccPaymentEligibilityChecker = new PaymentMethodEligibilityChecker({
 *     code: 'order-total-payment-eligibility-checker',
 *     description: [{ languageCode: LanguageCode.en, value: 'Checks that the order total is above some minimum value' }],
 *     args: {
 *         orderMinimum: { type: 'int', ui: { component: 'currency-form-input' } },
 *     },
 *     check: (ctx, order, args) => {
 *         return order.totalWithTax >= args.orderMinimum;
 *     },
 * });
 * ```
 *
 * @docsCategory payment
 * @docsPage PaymentMethodEligibilityChecker
 * @docsWeight 0
 */
class PaymentMethodEligibilityChecker extends configurable_operation_1.ConfigurableOperationDef {
    constructor(config) {
        super(config);
        this.checkFn = config.check;
    }
    /**
     * @description
     * Check the given Order to determine whether it is eligible.
     *
     * @internal
     */
    async check(ctx, order, args, method) {
        return this.checkFn(ctx, order, this.argsArrayToHash(args), method);
    }
}
exports.PaymentMethodEligibilityChecker = PaymentMethodEligibilityChecker;
//# sourceMappingURL=payment-method-eligibility-checker.js.map