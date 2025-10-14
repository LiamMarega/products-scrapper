"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired whenever a search query is executed.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.6.0
 */
class SearchEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, input) {
        super();
        this.ctx = ctx;
        this.input = input;
    }
}
exports.SearchEvent = SearchEvent;
//# sourceMappingURL=search-event.js.map