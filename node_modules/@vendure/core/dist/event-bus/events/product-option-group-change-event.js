"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductOptionGroupChangeEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired whenever a {@link ProductOptionGroup} is assigned or removed from a {@link Product}.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
class ProductOptionGroupChangeEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, product, optionGroupId, type) {
        super();
        this.ctx = ctx;
        this.product = product;
        this.optionGroupId = optionGroupId;
        this.type = type;
    }
}
exports.ProductOptionGroupChangeEvent = ProductOptionGroupChangeEvent;
//# sourceMappingURL=product-option-group-change-event.js.map