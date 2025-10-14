"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStateTransitionEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired whenever a {@link Payment} transitions from one {@link PaymentState} to another, e.g.
 * a Payment is authorized by the payment provider.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class PaymentStateTransitionEvent extends vendure_event_1.VendureEvent {
    constructor(fromState, toState, ctx, payment, order) {
        super();
        this.fromState = fromState;
        this.toState = toState;
        this.ctx = ctx;
        this.payment = payment;
        this.order = order;
    }
}
exports.PaymentStateTransitionEvent = PaymentStateTransitionEvent;
//# sourceMappingURL=payment-state-transition-event.js.map