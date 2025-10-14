"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionEvent = void 0;
const vendure_entity_event_1 = require("../vendure-entity-event");
/**
 * @description
 * This event is fired whenever a {@link Promotion} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class PromotionEvent extends vendure_entity_event_1.VendureEntityEvent {
    constructor(ctx, entity, type, input) {
        super(entity, type, ctx, input);
    }
}
exports.PromotionEvent = PromotionEvent;
//# sourceMappingURL=promotion-event.js.map