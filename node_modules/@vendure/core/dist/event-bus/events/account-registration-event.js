"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRegistrationEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired when a new user registers an account, either as a stand-alone signup or after
 * placing an order.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class AccountRegistrationEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, user) {
        super();
        this.ctx = ctx;
        this.user = user;
    }
}
exports.AccountRegistrationEvent = AccountRegistrationEvent;
//# sourceMappingURL=account-registration-event.js.map