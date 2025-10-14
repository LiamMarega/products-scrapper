"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryEntryEvent = void 0;
const vendure_entity_event_1 = require("../vendure-entity-event");
/**
 * @description
 * This event is fired whenever one {@link HistoryEntry} is added, updated or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
class HistoryEntryEvent extends vendure_entity_event_1.VendureEntityEvent {
    constructor(ctx, entity, type, historyType, input) {
        super(entity, type, ctx, input);
        this.historyType = historyType;
    }
}
exports.HistoryEntryEvent = HistoryEntryEvent;
//# sourceMappingURL=history-entry-event.js.map