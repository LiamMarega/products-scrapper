"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantPriceEvent = void 0;
const vendure_entity_event_1 = require("../vendure-entity-event");
/**
 * @description
 * This event is fired whenever a {@link ProductVariantPrice} is added, updated or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 2.2.0
 */
class ProductVariantPriceEvent extends vendure_entity_event_1.VendureEntityEvent {
    constructor(ctx, entity, type, input) {
        super(entity, type, ctx, input);
    }
}
exports.ProductVariantPriceEvent = ProductVariantPriceEvent;
//# sourceMappingURL=product-variant-price-event.js.map