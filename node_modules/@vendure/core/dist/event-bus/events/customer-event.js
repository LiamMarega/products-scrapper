"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerEvent = void 0;
const vendure_entity_event_1 = require("../vendure-entity-event");
/**
 * @description
 * This event is fired whenever a {@link Customer} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class CustomerEvent extends vendure_entity_event_1.VendureEntityEvent {
    constructor(ctx, entity, type, input) {
        super(entity, type, ctx, input);
    }
    /**
     * Return a customer field to become compatible with the
     * deprecated old version of CustomerEvent
     * @deprecated Use `entity` instead
     * @since 1.4
     */
    get customer() {
        return this.entity;
    }
}
exports.CustomerEvent = CustomerEvent;
//# sourceMappingURL=customer-event.js.map