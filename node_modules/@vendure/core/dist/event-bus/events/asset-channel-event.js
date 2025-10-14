"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetChannelEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired whenever an {@link Asset} is assigned or removed
 * From a channel.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class AssetChannelEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, asset, channelId, type) {
        super();
        this.ctx = ctx;
        this.asset = asset;
        this.channelId = channelId;
        this.type = type;
    }
}
exports.AssetChannelEvent = AssetChannelEvent;
//# sourceMappingURL=asset-channel-event.js.map