"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductChannelEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired whenever a {@link Product} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class ProductChannelEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, product, channelId, type) {
        super();
        this.ctx = ctx;
        this.product = product;
        this.channelId = channelId;
        this.type = type;
    }
}
exports.ProductChannelEvent = ProductChannelEvent;
//# sourceMappingURL=product-channel-event.js.map