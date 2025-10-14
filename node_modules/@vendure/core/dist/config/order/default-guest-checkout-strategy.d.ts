import { CreateCustomerInput, SetCustomerForOrderResult } from '@vendure/common/lib/generated-shop-types';
import { RequestContext } from '../../api/common/request-context';
import { ErrorResultUnion } from '../../common/error/error-result';
import { Injector } from '../../common/injector';
import { Customer, Order } from '../../entity/index';
import { GuestCheckoutStrategy } from './guest-checkout-strategy';
/**
 * @description
 * Options available for the {@link DefaultGuestCheckoutStrategy}.
 *
 * @docsCategory orders
 * @docsPage DefaultGuestCheckoutStrategy
 * @since 2.0.0
 */
export interface DefaultGuestCheckoutStrategyOptions {
    /**
     * @description
     * Whether to allow guest checkouts.
     *
     * @default true
     */
    allowGuestCheckouts?: boolean;
    /**
     * @description
     * Whether to allow guest checkouts for customers who already have an account.
     * Note that when this is enabled, the details provided in the `CreateCustomerInput`
     * will overwrite the existing customer details of the registered customer.
     *
     * @default false
     */
    allowGuestCheckoutForRegisteredCustomers?: boolean;
}
/**
 * @description
 * The default implementation of the {@link GuestCheckoutStrategy}. This strategy allows
 * guest checkouts by default, but can be configured to disallow them.
 *
 * @example
 * ```ts
 * import { DefaultGuestCheckoutStrategy, VendureConfig } from '\@vendure/core';
 *
 * export const config: VendureConfig = {
 *   orderOptions: {
 *     guestCheckoutStrategy: new DefaultGuestCheckoutStrategy({
 *       allowGuestCheckouts: false,
 *       allowGuestCheckoutForRegisteredCustomers: false,
 *     }),
 *   },
 *   // ...
 * };
 * ```
 *
 * @docsCategory orders
 * @docsPage DefaultGuestCheckoutStrategy
 * @docsWeight 0
 * @since 2.0.0
 */
export declare class DefaultGuestCheckoutStrategy implements GuestCheckoutStrategy {
    private customerService;
    private readonly options;
    init(injector: Injector): void;
    constructor(options?: DefaultGuestCheckoutStrategyOptions);
    setCustomerForOrder(ctx: RequestContext, order: Order, input: CreateCustomerInput): Promise<ErrorResultUnion<SetCustomerForOrderResult, Customer>>;
}
