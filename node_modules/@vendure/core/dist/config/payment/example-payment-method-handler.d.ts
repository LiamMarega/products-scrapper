import { PaymentMethodHandler } from './payment-method-handler';
/**
 * An example of a payment method which sets up and authorizes the payment on the client side and then
 * requires a further step on the server side to charge the card.
 */
export declare const examplePaymentHandler: PaymentMethodHandler<{
    automaticCapture: {
        type: "boolean";
        required: false;
    };
    apiKey: {
        type: "string";
        required: false;
    };
}>;
