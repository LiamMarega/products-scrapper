"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired whenever a {@link Refund} is created
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class RefundEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, order, refund, type) {
        super();
        this.ctx = ctx;
        this.order = order;
        this.refund = refund;
        this.type = type;
    }
}
exports.RefundEvent = RefundEvent;
//# sourceMappingURL=refund-event.js.map