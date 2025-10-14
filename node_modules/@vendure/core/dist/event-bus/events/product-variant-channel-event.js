"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantChannelEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired whenever a {@link ProductVariant} is assigned or removed from a {@link Channel}.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class ProductVariantChannelEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, productVariant, channelId, type) {
        super();
        this.ctx = ctx;
        this.productVariant = productVariant;
        this.channelId = channelId;
        this.type = type;
    }
}
exports.ProductVariantChannelEvent = ProductVariantChannelEvent;
//# sourceMappingURL=product-variant-channel-event.js.map