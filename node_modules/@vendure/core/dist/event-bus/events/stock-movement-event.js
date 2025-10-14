"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockMovementEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired whenever a {@link StockMovement} entity is created, which occurs when the saleable
 * stock level of a ProductVariant is altered due to things like sales, manual adjustments, and cancellations.
 *
 * @since 1.1.0
 * @docsCategory events
 * @docsPage Event Types
 */
class StockMovementEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, stockMovements) {
        var _a;
        super();
        this.ctx = ctx;
        this.stockMovements = stockMovements;
        this.type = (_a = stockMovements[0]) === null || _a === void 0 ? void 0 : _a.type;
    }
}
exports.StockMovementEvent = StockMovementEvent;
//# sourceMappingURL=stock-movement-event.js.map