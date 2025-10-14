"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodHandler = void 0;
const configurable_operation_1 = require("../../common/configurable-operation");
/**
 * @description
 * A PaymentMethodHandler contains the code which is used to generate a Payment when a call to the
 * `addPaymentToOrder` mutation is made. It contains any necessary steps of interfacing with a
 * third-party payment gateway before the Payment is created and can also define actions to fire
 * when the state of the payment is changed.
 *
 * PaymentMethodHandlers are instantiated using a {@link PaymentMethodConfigOptions} object, which
 * configures the business logic used to create, settle and refund payments.
 *
 * @example
 * ```ts
 * import { PaymentMethodHandler, CreatePaymentResult, SettlePaymentResult, LanguageCode } from '\@vendure/core';
 * // A mock 3rd-party payment SDK
 * import gripeSDK from 'gripe';
 *
 * export const examplePaymentHandler = new PaymentMethodHandler({
 *   code: 'example-payment-provider',
 *   description: [{
 *     languageCode: LanguageCode.en,
 *     value: 'Example Payment Provider',
 *   }],
 *   args: {
 *     apiKey: { type: 'string' },
 *   },
 *   createPayment: async (ctx, order, amount, args, metadata): Promise<CreatePaymentResult> => {
 *     try {
 *       const result = await gripeSDK.charges.create({
 *         amount,
 *         apiKey: args.apiKey,
 *         source: metadata.authToken,
 *       });
 *       return {
 *         amount: order.total,
 *         state: 'Settled' as const,
 *         transactionId: result.id.toString(),
 *         metadata: result.outcome,
 *       };
 *     } catch (err: any) {
 *       return {
 *         amount: order.total,
 *         state: 'Declined' as const,
 *         metadata: {
 *           errorMessage: err.message,
 *         },
 *       };
 *     }
 *   },
 *   settlePayment: async (ctx, order, payment, args): Promise<SettlePaymentResult> => {
 *     return { success: true };
 *   }
 * });
 * ```
 *
 * @docsCategory payment
 */
class PaymentMethodHandler extends configurable_operation_1.ConfigurableOperationDef {
    constructor(config) {
        super(config);
        this.createPaymentFn = config.createPayment;
        this.settlePaymentFn = config.settlePayment;
        this.cancelPaymentFn = config.cancelPayment;
        this.createRefundFn = config.createRefund;
        this.onTransitionStartFn = config.onStateTransitionStart;
    }
    /**
     * @description
     * Called internally to create a new Payment
     *
     * @internal
     */
    async createPayment(ctx, order, amount, args, metadata, method) {
        const paymentConfig = await this.createPaymentFn(ctx, order, amount, this.argsArrayToHash(args), metadata, method);
        return Object.assign({ method: this.code, metadata: {} }, paymentConfig);
    }
    /**
     * @description
     * Called internally to settle a payment
     *
     * @internal
     */
    async settlePayment(ctx, order, payment, args, method) {
        return this.settlePaymentFn(ctx, order, payment, this.argsArrayToHash(args), method);
    }
    /**
     * @description
     * Called internally to cancel a payment
     *
     * @internal
     */
    async cancelPayment(ctx, order, payment, args, method) {
        var _a;
        return (_a = this.cancelPaymentFn) === null || _a === void 0 ? void 0 : _a.call(this, ctx, order, payment, this.argsArrayToHash(args), method);
    }
    /**
     * @description
     * Called internally to create a refund
     *
     * @internal
     */
    async createRefund(ctx, input, amount, order, payment, args, method) {
        return this.createRefundFn
            ? this.createRefundFn(ctx, input, amount, order, payment, this.argsArrayToHash(args), method)
            : false;
    }
    /**
     * @description
     * This function is called before the state of a Payment is transitioned. If the PaymentMethodHandler
     * was instantiated with a `onStateTransitionStart` function, that function will be invoked and its
     * return value used to determine whether the transition can occur.
     *
     * @internal
     */
    onStateTransitionStart(fromState, toState, data) {
        if (typeof this.onTransitionStartFn === 'function') {
            return this.onTransitionStartFn(fromState, toState, data);
        }
        else {
            return true;
        }
    }
}
exports.PaymentMethodHandler = PaymentMethodHandler;
//# sourceMappingURL=payment-method-handler.js.map