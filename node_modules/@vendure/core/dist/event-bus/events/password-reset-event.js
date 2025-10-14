"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired when a Customer requests a password reset email.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class PasswordResetEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, user) {
        super();
        this.ctx = ctx;
        this.user = user;
    }
}
exports.PasswordResetEvent = PasswordResetEvent;
//# sourceMappingURL=password-reset-event.js.map