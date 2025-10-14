"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetEvent = void 0;
const vendure_entity_event_1 = require("../vendure-entity-event");
/**
 * @description
 * This event is fired whenever a {@link Asset} is added, updated or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
class AssetEvent extends vendure_entity_event_1.VendureEntityEvent {
    constructor(ctx, entity, type, input) {
        super(entity, type, ctx, input);
    }
    /**
     * Return an asset field to become compatible with the
     * deprecated old version of AssetEvent
     * @deprecated Use `entity` instead
     * @since 1.4
     */
    get asset() {
        return this.entity;
    }
}
exports.AssetEvent = AssetEvent;
//# sourceMappingURL=asset-event.js.map