"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendureEntityEvent = void 0;
const vendure_event_1 = require("./vendure-event");
/**
 * @description
 * The base class for all entity events used by the EventBus system.
 * * For event type `'deleted'` the input will most likely be an `id: ID`
 *
 * @docsCategory events
 * */
class VendureEntityEvent extends vendure_event_1.VendureEvent {
    constructor(entity, type, ctx, input) {
        super();
        this.entity = entity;
        this.type = type;
        this.ctx = ctx;
        this.input = input;
    }
}
exports.VendureEntityEvent = VendureEntityEvent;
//# sourceMappingURL=vendure-entity-event.js.map