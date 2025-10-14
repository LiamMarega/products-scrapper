"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetVerifiedEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired when a password reset is executed with a verified token.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
class PasswordResetVerifiedEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, user) {
        super();
        this.ctx = ctx;
        this.user = user;
    }
}
exports.PasswordResetVerifiedEvent = PasswordResetVerifiedEvent;
//# sourceMappingURL=password-reset-verified-event.js.map