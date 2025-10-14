"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelEvent = void 0;
const vendure_entity_event_1 = require("../vendure-entity-event");
/**
 * @description
 * This event is fired whenever a {@link Channel} is added, updated or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
class ChannelEvent extends vendure_entity_event_1.VendureEntityEvent {
    constructor(ctx, entity, type, input) {
        super(entity, type, ctx, input);
    }
}
exports.ChannelEvent = ChannelEvent;
//# sourceMappingURL=channel-event.js.map