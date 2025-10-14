"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantEvent = void 0;
const vendure_entity_event_1 = require("../vendure-entity-event");
/**
 * @description
 * This event is fired whenever a {@link ProductVariant} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class ProductVariantEvent extends vendure_entity_event_1.VendureEntityEvent {
    constructor(ctx, entity, type, input) {
        super(entity, type, ctx, input);
    }
    /**
     * Return an variants field to become compatible with the
     * deprecated old version of ProductEvent
     * @deprecated Use `entity` instead
     * @since 1.4
     */
    get variants() {
        return this.entity;
    }
}
exports.ProductVariantEvent = ProductVariantEvent;
//# sourceMappingURL=product-variant-event.js.map