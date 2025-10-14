"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dummyPaymentHandler = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const payment_method_handler_1 = require("./payment-method-handler");
/**
 * @description
 * A dummy PaymentMethodHandler which simply creates a Payment without any integration
 * with an external payment provider. Intended only for use in development.
 *
 * By specifying certain metadata keys, failures can be simulated:
 * @example
 * ```GraphQL
 * addPaymentToOrder(input: {
 *   method: 'dummy-payment-method',
 *   metadata: {
 *     shouldDecline: false,
 *     shouldError: false,
 *     shouldErrorOnSettle: true,
 *   }
 * }) {
 *   # ...
 * }
 * ```
 *
 * @docsCategory payment
 */
exports.dummyPaymentHandler = new payment_method_handler_1.PaymentMethodHandler({
    code: 'dummy-payment-handler',
    description: [
        {
            languageCode: generated_types_1.LanguageCode.en,
            value: 'A dummy payment provider intended for testing and development only.',
        },
    ],
    args: {
        automaticSettle: {
            type: 'boolean',
            label: [
                {
                    languageCode: generated_types_1.LanguageCode.en,
                    value: 'Authorize and settle in 1 step',
                },
            ],
            description: [
                {
                    languageCode: generated_types_1.LanguageCode.en,
                    value: 'If enabled, Payments will be created in the "Settled" state.',
                },
            ],
            required: true,
            defaultValue: false,
        },
    },
    createPayment: async (ctx, order, amount, args, metadata, method) => {
        if (metadata.shouldDecline) {
            return {
                amount,
                state: 'Declined',
                metadata: {
                    errorMessage: 'Simulated decline',
                },
            };
        }
        else if (metadata.shouldError) {
            return {
                amount,
                state: 'Error',
                errorMessage: 'Simulated error',
                metadata: {
                    errorMessage: 'Simulated error',
                },
            };
        }
        else {
            return {
                amount,
                state: args.automaticSettle ? 'Settled' : 'Authorized',
                transactionId: Math.random().toString(36).substr(3),
                metadata,
            };
        }
    },
    settlePayment: async (ctx, order, payment, args, method) => {
        if (payment.metadata.shouldErrorOnSettle) {
            return {
                success: false,
                errorMessage: 'Simulated settlement error',
            };
        }
        return {
            success: true,
        };
    },
    cancelPayment: (ctx, order, payment) => {
        return {
            success: true,
            metadata: {
                cancellationDate: new Date().toISOString(),
            },
        };
    },
});
//# sourceMappingURL=dummy-payment-method-handler.js.map