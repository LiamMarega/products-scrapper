"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdministratorEvent = void 0;
const vendure_entity_event_1 = require("../vendure-entity-event");
/**
 * @description
 * This event is fired whenever a {@link Administrator} is added, updated or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
class AdministratorEvent extends vendure_entity_event_1.VendureEntityEvent {
    constructor(ctx, entity, type, input) {
        super(entity, type, ctx, input);
    }
}
exports.AdministratorEvent = AdministratorEvent;
//# sourceMappingURL=administrator-event.js.map