"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderPlacedEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired whenever an {@link Order} is set as "placed", which by default is
 * when it transitions from 'ArrangingPayment' to either 'PaymentAuthorized' or 'PaymentSettled'.
 *
 * Note that the exact point that it is set as "placed" can be configured according to the
 * {@link OrderPlacedStrategy}.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class OrderPlacedEvent extends vendure_event_1.VendureEvent {
    constructor(fromState, toState, ctx, order) {
        super();
        this.fromState = fromState;
        this.toState = toState;
        this.ctx = ctx;
        this.order = order;
    }
}
exports.OrderPlacedEvent = OrderPlacedEvent;
//# sourceMappingURL=order-placed-event.js.map