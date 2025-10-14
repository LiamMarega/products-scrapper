"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductOptionGroupEvent = void 0;
const vendure_entity_event_1 = require("../vendure-entity-event");
/**
 * @description
 * This event is fired whenever a {@link ProductOptionGroup} is added or updated.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
class ProductOptionGroupEvent extends vendure_entity_event_1.VendureEntityEvent {
    constructor(ctx, entity, type, input) {
        super(entity, type, ctx, input);
    }
}
exports.ProductOptionGroupEvent = ProductOptionGroupEvent;
//# sourceMappingURL=product-option-group-event.js.map