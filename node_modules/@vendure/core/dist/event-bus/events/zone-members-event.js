"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoneMembersEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired whenever a {@link Zone} gets {@link Country} members assigned or removed
 * The `entity` property contains the zone with the already updated member field.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
class ZoneMembersEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, entity, type, memberIds) {
        super();
        this.ctx = ctx;
        this.entity = entity;
        this.type = type;
        this.memberIds = memberIds;
    }
}
exports.ZoneMembersEvent = ZoneMembersEvent;
//# sourceMappingURL=zone-members-event.js.map