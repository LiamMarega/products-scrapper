"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductEvent = void 0;
const vendure_entity_event_1 = require("../vendure-entity-event");
/**
 * @description
 * This event is fired whenever a {@link Product} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class ProductEvent extends vendure_entity_event_1.VendureEntityEvent {
    constructor(ctx, entity, type, input) {
        super(entity, type, ctx, input);
    }
    /**
     * Return an product field to become compatible with the
     * deprecated old version of ProductEvent
     * @deprecated Use `entity` instead
     * @since 1.4
     */
    get product() {
        return this.entity;
    }
}
exports.ProductEvent = ProductEvent;
//# sourceMappingURL=product-event.js.map