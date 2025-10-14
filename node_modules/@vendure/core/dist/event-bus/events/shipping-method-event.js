"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingMethodEvent = void 0;
const vendure_entity_event_1 = require("../vendure-entity-event");
/**
 * @description
 * This event is fired whenever a {@link ShippingMethod} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class ShippingMethodEvent extends vendure_entity_event_1.VendureEntityEvent {
    constructor(ctx, entity, type, input) {
        super(entity, type, ctx, input);
    }
}
exports.ShippingMethodEvent = ShippingMethodEvent;
//# sourceMappingURL=shipping-method-event.js.map