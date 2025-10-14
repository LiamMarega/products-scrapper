"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderLineEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired whenever an {@link OrderLine} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class OrderLineEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, order, orderLine, type) {
        super();
        this.ctx = ctx;
        this.order = order;
        this.orderLine = orderLine;
        this.type = type;
    }
}
exports.OrderLineEvent = OrderLineEvent;
//# sourceMappingURL=order-line-event.js.map