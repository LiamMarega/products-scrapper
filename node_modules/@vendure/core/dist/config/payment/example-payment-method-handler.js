"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.examplePaymentHandler = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const payment_method_handler_1 = require("./payment-method-handler");
/**
 * A dummy API to simulate an SDK provided by a popular payments service.
 */
const gripeSDK = {
    charges: {
        create: (options) => {
            return Promise.resolve({
                id: Math.random().toString(36).substr(3),
            });
        },
        capture: async (transactionId) => {
            return true;
        },
    },
};
/**
 * An example of a payment method which sets up and authorizes the payment on the client side and then
 * requires a further step on the server side to charge the card.
 */
exports.examplePaymentHandler = new payment_method_handler_1.PaymentMethodHandler({
    code: 'example-payment-provider',
    description: [{ languageCode: generated_types_1.LanguageCode.en, value: 'Example Payment Provider' }],
    args: {
        automaticCapture: { type: 'boolean', required: false },
        apiKey: { type: 'string', required: false },
    },
    createPayment: async (ctx, order, amount, args, metadata, method) => {
        try {
            const result = await gripeSDK.charges.create({
                apiKey: args.apiKey,
                amount,
                source: metadata.authToken,
            });
            return {
                amount,
                state: args.automaticCapture ? 'Settled' : 'Authorized',
                transactionId: result.id.toString(),
                metadata,
            };
        }
        catch (err) {
            return {
                amount,
                state: 'Declined',
                metadata: {
                    errorMessage: err.message,
                },
            };
        }
    },
    settlePayment: async (ctx, order, payment, args, method) => {
        const result = await gripeSDK.charges.capture(payment.transactionId);
        return {
            success: result,
            metadata: {
                captureId: '1234567',
            },
        };
    },
});
//# sourceMappingURL=example-payment-method-handler.js.map