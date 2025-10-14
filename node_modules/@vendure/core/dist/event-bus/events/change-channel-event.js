"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeChannelEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired whenever an {@link ChannelAware} entity is assigned or removed
 * from a channel. The entity property contains the value before updating the channels.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
class ChangeChannelEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, entity, channelIds, type, entityType) {
        super();
        this.ctx = ctx;
        this.entity = entity;
        this.channelIds = channelIds;
        this.type = type;
        this.entityType = entityType;
    }
}
exports.ChangeChannelEvent = ChangeChannelEvent;
//# sourceMappingURL=change-channel-event.js.map