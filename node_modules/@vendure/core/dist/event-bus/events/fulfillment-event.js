"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FulfillmentEvent = void 0;
const vendure_entity_event_1 = require("../vendure-entity-event");
/**
 * @description
 * This event is fired whenever a {@link Fulfillment} is added. The type is always `created`.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
class FulfillmentEvent extends vendure_entity_event_1.VendureEntityEvent {
    constructor(ctx, entity, input) {
        super(entity, 'created', ctx, input);
    }
}
exports.FulfillmentEvent = FulfillmentEvent;
//# sourceMappingURL=fulfillment-event.js.map