"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifierChangeRequestEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired when a registered user requests to update the identifier (ie email address)
 * associated with the account.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class IdentifierChangeRequestEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, user) {
        super();
        this.ctx = ctx;
        this.user = user;
    }
}
exports.IdentifierChangeRequestEvent = IdentifierChangeRequestEvent;
//# sourceMappingURL=identifier-change-request-event.js.map