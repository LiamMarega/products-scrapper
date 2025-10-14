"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionModificationEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired whenever a Collection is modified in some way. The `productVariantIds`
 * argument is an array of ids of all ProductVariants which:
 *
 * 1. were part of this collection prior to modification and are no longer
 * 2. are now part of this collection after modification but were not before
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class CollectionModificationEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, collection, productVariantIds) {
        super();
        this.ctx = ctx;
        this.collection = collection;
        this.productVariantIds = productVariantIds;
    }
}
exports.CollectionModificationEvent = CollectionModificationEvent;
//# sourceMappingURL=collection-modification-event.js.map