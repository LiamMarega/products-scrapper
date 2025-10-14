"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendureEvent = void 0;
/**
 * @description
 * The base class for all events used by the EventBus system.
 *
 * @docsCategory events
 * */
class VendureEvent {
    constructor() {
        this.createdAt = new Date();
    }
}
exports.VendureEvent = VendureEvent;
//# sourceMappingURL=vendure-event.js.map