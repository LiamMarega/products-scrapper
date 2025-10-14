"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductOptionEvent = void 0;
const vendure_entity_event_1 = require("../vendure-entity-event");
/**
 * @description
 * This event is fired whenever a {@link ProductOption} is added or updated.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
class ProductOptionEvent extends vendure_entity_event_1.VendureEntityEvent {
    constructor(ctx, entity, type, input) {
        super(entity, type, ctx, input);
    }
}
exports.ProductOptionEvent = ProductOptionEvent;
//# sourceMappingURL=product-option-event.js.map