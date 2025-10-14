"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStateTransitionEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired whenever an {@link Order} transitions from one {@link OrderState} to another.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class OrderStateTransitionEvent extends vendure_event_1.VendureEvent {
    constructor(fromState, toState, ctx, order) {
        super();
        this.fromState = fromState;
        this.toState = toState;
        this.ctx = ctx;
        this.order = order;
    }
}
exports.OrderStateTransitionEvent = OrderStateTransitionEvent;
//# sourceMappingURL=order-state-transition-event.js.map