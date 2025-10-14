"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttemptedLoginEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired when an attempt is made to log in via the shop or admin API `login` mutation.
 * The `strategy` represents the name of the AuthenticationStrategy used in the login attempt.
 * If the "native" strategy is used, the additional `identifier` property will be available.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class AttemptedLoginEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, strategy, identifier) {
        super();
        this.ctx = ctx;
        this.strategy = strategy;
        this.identifier = identifier;
    }
}
exports.AttemptedLoginEvent = AttemptedLoginEvent;
//# sourceMappingURL=attempted-login-event.js.map