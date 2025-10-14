import { OrderState } from '../../service/helpers/order-state-machine/order-state';
import { OrderProcess } from './order-process';
declare module '../../service/helpers/order-state-machine/order-state' {
    interface OrderStates {
        ArrangingPayment: never;
        PaymentAuthorized: never;
        PaymentSettled: never;
        PartiallyShipped: never;
        Shipped: never;
        PartiallyDelivered: never;
        Delivered: never;
        Modifying: never;
        ArrangingAdditionalPayment: never;
    }
}
/**
 * @description
 * Options which can be passed to the {@link configureDefaultOrderProcess} function
 * to configure an instance of the default {@link OrderProcess}. By default, all
 * options are set to `true`.
 *
 * @docsCategory Orders
 * @docsPage OrderProcess
 * @since 2.0.0
 */
export interface DefaultOrderProcessOptions {
    /**
     * @description
     * Prevents an Order from transitioning out of the `Modifying` state if
     * the Order price has changed and there is no Payment or Refund associated
     * with the Modification.
     *
     * @default true
     */
    checkModificationPayments?: boolean;
    /**
     * @description
     * Prevents an Order from transitioning out of the `ArrangingAdditionalPayment` state if
     * the Order's Payments do not cover the full amount of `totalWithTax`.
     *
     * @default true
     */
    checkAdditionalPaymentsAmount?: boolean;
    /**
     * @description
     * Prevents the transition from `AddingItems` to any other state (apart from `Cancelled`) if
     * and of the ProductVariants no longer exists due to deletion.
     *
     * @default true
     */
    checkAllVariantsExist?: boolean;
    /**
     * @description
     * Prevents transition to the `ArrangingPayment` state if the active Order has no lines.
     *
     * @default true
     */
    arrangingPaymentRequiresContents?: boolean;
    /**
     * @description
     * Prevents transition to the `ArrangingPayment` state if the active Order has no customer
     * associated with it.
     *
     * @default true
     */
    arrangingPaymentRequiresCustomer?: boolean;
    /**
     * @description
     * Prevents transition to the `ArrangingPayment` state if the active Order has no shipping
     * method set.
     *
     * @default true
     */
    arrangingPaymentRequiresShipping?: boolean;
    /**
     * @description
     * Prevents transition to the `ArrangingPayment` state if there is insufficient saleable
     * stock to cover the contents of the Order.
     *
     * @default true
     */
    arrangingPaymentRequiresStock?: boolean;
    /**
     * @description
     * Prevents transition to the `PaymentAuthorized` or `PaymentSettled` states if the order
     * `totalWithTax` amount is not covered by Payment(s) in the corresponding states.
     *
     * @default true
     */
    checkPaymentsCoverTotal?: boolean;
    /**
     * @description
     * Prevents transition to the `Cancelled` state unless all OrderItems are already
     * cancelled.
     *
     * @default true
     */
    checkAllItemsBeforeCancel?: boolean;
    /**
     * @description
     * Prevents transition to the `Shipped`, `PartiallyShipped`, `Delivered` & `PartiallyDelivered` states unless
     * there are corresponding Fulfillments in the correct states to allow this. E.g. `Shipped` only if all items in
     * the Order are part of a Fulfillment which itself is in the `Shipped` state.
     *
     * @default true
     */
    checkFulfillmentStates?: boolean;
}
/**
 * @description
 * Used to configure a customized instance of the default {@link OrderProcess} that ships with Vendure.
 * Using this function allows you to turn off certain checks and constraints that are enabled by default.
 *
 * ```ts
 * import { configureDefaultOrderProcess, VendureConfig } from '\@vendure/core';
 *
 * const myCustomOrderProcess = configureDefaultOrderProcess({
 *   // Disable the constraint that requires
 *   // Orders to have a shipping method assigned
 *   // before payment.
 *   arrangingPaymentRequiresShipping: false,
 * });
 *
 * export const config: VendureConfig = {
 *   orderOptions: {
 *     process: [myCustomOrderProcess],
 *   },
 * };
 * ```
 * The {@link DefaultOrderProcessOptions} type defines all available options. If you require even
 * more customization, you can create your own implementation of the {@link OrderProcess} interface.
 *
 *
 * @docsCategory Orders
 * @docsPage OrderProcess
 * @since 2.0.0
 */
export declare function configureDefaultOrderProcess(options: DefaultOrderProcessOptions): OrderProcess<OrderState>;
/**
 * @description
 * This is the built-in {@link OrderProcess} that ships with Vendure. A customized version of this process
 * can be created using the {@link configureDefaultOrderProcess} function, which allows you to pass in an object
 * to enable/disable certain checks.
 *
 * @docsCategory Orders
 * @docsPage OrderProcess
 * @since 2.0.0
 */
export declare const defaultOrderProcess: OrderProcess<OrderState>;
