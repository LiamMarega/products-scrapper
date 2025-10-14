"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalSettingsEvent = void 0;
const vendure_entity_event_1 = require("../vendure-entity-event");
/**
 * @description
 * This event is fired whenever a {@link GlobalSettings} is added. The type is always `updated`, because it's
 * only created once and never deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
class GlobalSettingsEvent extends vendure_entity_event_1.VendureEntityEvent {
    constructor(ctx, entity, input) {
        super(entity, 'updated', ctx, input);
    }
}
exports.GlobalSettingsEvent = GlobalSettingsEvent;
//# sourceMappingURL=global-settings-event.js.map