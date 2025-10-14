"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxRateModificationEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired whenever a TaxRate is changed
 *
 * @docsCategory events
 * @docsPage Event Types
 * @deprecated Use TaxRateEvent instead
 */
class TaxRateModificationEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, taxRate) {
        super();
        this.ctx = ctx;
        this.taxRate = taxRate;
    }
}
exports.TaxRateModificationEvent = TaxRateModificationEvent;
//# sourceMappingURL=tax-rate-modification-event.js.map