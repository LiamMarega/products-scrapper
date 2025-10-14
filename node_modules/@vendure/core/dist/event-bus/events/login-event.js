"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired when a user successfully logs in via the shop or admin API `login` mutation.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class LoginEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, user) {
        super();
        this.ctx = ctx;
        this.user = user;
    }
}
exports.LoginEvent = LoginEvent;
//# sourceMappingURL=login-event.js.map