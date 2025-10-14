"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountVerifiedEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired when a users email address successfully gets verified after
 * the `verifyCustomerAccount` mutation was executed.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class AccountVerifiedEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, customer) {
        super();
        this.ctx = ctx;
        this.customer = customer;
    }
}
exports.AccountVerifiedEvent = AccountVerifiedEvent;
//# sourceMappingURL=account-verified-event.js.map