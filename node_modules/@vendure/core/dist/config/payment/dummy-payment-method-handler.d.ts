import { LanguageCode } from '@vendure/common/lib/generated-types';
import { PaymentMethodHandler } from './payment-method-handler';
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
export declare const dummyPaymentHandler: PaymentMethodHandler<{
    automaticSettle: {
        type: "boolean";
        label: {
            languageCode: LanguageCode.en;
            value: string;
        }[];
        description: {
            languageCode: LanguageCode.en;
            value: string;
        }[];
        required: true;
        defaultValue: false;
    };
}>;
