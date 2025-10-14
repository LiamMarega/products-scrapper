"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializerEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired when vendure finished initializing its services inside the {@link InitializerService}
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.7.0
 */
class InitializerEvent extends vendure_event_1.VendureEvent {
    constructor() {
        super();
    }
}
exports.InitializerEvent = InitializerEvent;
//# sourceMappingURL=initializer-event.js.map