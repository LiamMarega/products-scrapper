"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultGuestCheckoutStrategy = void 0;
const generated_graphql_shop_errors_1 = require("../../common/error/generated-graphql-shop-errors");
const customer_service_1 = require("../../service/services/customer.service");
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
class DefaultGuestCheckoutStrategy {
    init(injector) {
        this.customerService = injector.get(customer_service_1.CustomerService);
    }
    constructor(options) {
        this.options = {
            allowGuestCheckouts: true,
            allowGuestCheckoutForRegisteredCustomers: false,
        };
        this.options = Object.assign(Object.assign({}, this.options), (options !== null && options !== void 0 ? options : {}));
    }
    async setCustomerForOrder(ctx, order, input) {
        if (!this.options.allowGuestCheckouts) {
            return new generated_graphql_shop_errors_1.GuestCheckoutError({ errorDetail: 'Guest checkouts are disabled' });
        }
        if (ctx.activeUserId) {
            return new generated_graphql_shop_errors_1.AlreadyLoggedInError();
        }
        const errorOnExistingUser = !this.options.allowGuestCheckoutForRegisteredCustomers;
        const customer = await this.customerService.createOrUpdate(ctx, input, errorOnExistingUser);
        return customer;
    }
}
exports.DefaultGuestCheckoutStrategy = DefaultGuestCheckoutStrategy;
//# sourceMappingURL=default-guest-checkout-strategy.js.map