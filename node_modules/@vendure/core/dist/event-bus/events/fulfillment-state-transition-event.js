"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FulfillmentStateTransitionEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired whenever an {@link Fulfillment} transitions from one {@link FulfillmentState} to another.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class FulfillmentStateTransitionEvent extends vendure_event_1.VendureEvent {
    constructor(fromState, toState, ctx, fulfillment) {
        super();
        this.fromState = fromState;
        this.toState = toState;
        this.ctx = ctx;
        this.fulfillment = fulfillment;
    }
}
exports.FulfillmentStateTransitionEvent = FulfillmentStateTransitionEvent;
//# sourceMappingURL=fulfillment-state-transition-event.js.map