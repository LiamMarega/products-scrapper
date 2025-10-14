import { PaymentState } from '../../service/helpers/payment-state-machine/payment-state';
import { PaymentProcess } from './payment-process';
declare module '../../service/helpers/payment-state-machine/payment-state' {
    interface PaymentStates {
        Authorized: never;
        Settled: never;
        Declined: never;
    }
}
/**
 * @description
 * The default {@link PaymentProcess}
 *
 * @docsCategory payment
 */
export declare const defaultPaymentProcess: PaymentProcess<PaymentState>;
