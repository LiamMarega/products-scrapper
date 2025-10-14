"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired when a user logs out via the shop or admin API `logout` mutation.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class LogoutEvent extends vendure_event_1.VendureEvent {
    constructor(ctx) {
        super();
        this.ctx = ctx;
    }
}
exports.LogoutEvent = LogoutEvent;
//# sourceMappingURL=logout-event.js.map