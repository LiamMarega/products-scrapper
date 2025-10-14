"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundStateTransitionEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired whenever a {@link Refund} transitions from one {@link RefundState} to another.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class RefundStateTransitionEvent extends vendure_event_1.VendureEvent {
    constructor(fromState, toState, ctx, refund, order) {
        super();
        this.fromState = fromState;
        this.toState = toState;
        this.ctx = ctx;
        this.refund = refund;
        this.order = order;
    }
}
exports.RefundStateTransitionEvent = RefundStateTransitionEvent;
//# sourceMappingURL=refund-state-transition-event.js.map