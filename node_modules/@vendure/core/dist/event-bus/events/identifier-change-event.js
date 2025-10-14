"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifierChangeEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired when a registered user successfully changes the identifier (ie email address)
 * associated with their account.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class IdentifierChangeEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, user, oldIdentifier) {
        super();
        this.ctx = ctx;
        this.user = user;
        this.oldIdentifier = oldIdentifier;
    }
}
exports.IdentifierChangeEvent = IdentifierChangeEvent;
//# sourceMappingURL=identifier-change-event.js.map