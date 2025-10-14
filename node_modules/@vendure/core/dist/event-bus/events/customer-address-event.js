"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerAddressEvent = void 0;
const vendure_entity_event_1 = require("../vendure-entity-event");
/**
 * @description
 * This event is fired whenever a {@link Address} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
class CustomerAddressEvent extends vendure_entity_event_1.VendureEntityEvent {
    constructor(ctx, entity, type, input) {
        super(entity, type, ctx, input);
        this.ctx = ctx;
        this.entity = entity;
        this.type = type;
        this.input = input;
    }
    /**
     * Return an address field to become compatible with the
     * deprecated old version of CustomerAddressEvent
     * @deprecated Use `entity` instead
     */
    get address() {
        return this.entity;
    }
}
exports.CustomerAddressEvent = CustomerAddressEvent;
//# sourceMappingURL=customer-address-event.js.map