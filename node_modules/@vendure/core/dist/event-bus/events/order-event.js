"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderEvent = void 0;
const vendure_entity_event_1 = require("../vendure-entity-event");
/**
 * @description
 * This event is fired whenever an {@link Order} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class OrderEvent extends vendure_entity_event_1.VendureEntityEvent {
    constructor(ctx, order, type, input) {
        super(order, type, ctx, input);
    }
    /**
     * Return a customer field to become compatible with the
     * deprecated old version of CustomerEvent
     * @deprecated Use `entity` instead
     * @since 3.4.0
     */
    get order() {
        return this.entity;
    }
}
exports.OrderEvent = OrderEvent;
//# sourceMappingURL=order-event.js.map