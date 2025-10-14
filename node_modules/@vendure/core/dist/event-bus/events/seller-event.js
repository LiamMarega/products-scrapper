"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerEvent = void 0;
const vendure_entity_event_1 = require("../vendure-entity-event");
/**
 * @description
 * This event is fired whenever one {@link Seller} is added, updated or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 2.0.1
 */
class SellerEvent extends vendure_entity_event_1.VendureEntityEvent {
    constructor(ctx, entity, type, input) {
        super(entity, type, ctx, input);
    }
}
exports.SellerEvent = SellerEvent;
//# sourceMappingURL=seller-event.js.map