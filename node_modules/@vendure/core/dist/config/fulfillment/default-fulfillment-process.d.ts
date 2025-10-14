import { FulfillmentState } from '../../service/helpers/fulfillment-state-machine/fulfillment-state';
import { FulfillmentProcess } from './fulfillment-process';
declare module '../../service/helpers/fulfillment-state-machine/fulfillment-state' {
    interface FulfillmentStates {
        Shipped: never;
        Delivered: never;
    }
}
/**
 * @description
 * The default {@link FulfillmentProcess}. This process includes the following actions:
 *
 * - Executes the configured `FulfillmentHandler.onFulfillmentTransition()` before any state
 *   transition.
 * - On cancellation of a Fulfillment, creates the necessary {@link Cancellation} & {@link Allocation}
 *   stock movement records.
 * - When a Fulfillment transitions from the `Created` to `Pending` state, the necessary
 *   {@link Sale} stock movements are created.
 *
 * @docsCategory fulfillment
 * @docsPage FulfillmentProcess
 * @since 2.0.0
 */
export declare const defaultFulfillmentProcess: FulfillmentProcess<FulfillmentState>;
