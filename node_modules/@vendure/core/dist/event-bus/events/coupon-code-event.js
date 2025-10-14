"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponCodeEvent = void 0;
const vendure_event_1 = require("../vendure-event");
/**
 * @description
 * This event is fired whenever an coupon code of an active {@link Promotion}
 * is assigned or removed to an {@link Order}.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
class CouponCodeEvent extends vendure_event_1.VendureEvent {
    constructor(ctx, couponCode, orderId, type) {
        super();
        this.ctx = ctx;
        this.couponCode = couponCode;
        this.orderId = orderId;
        this.type = type;
    }
}
exports.CouponCodeEvent = CouponCodeEvent;
//# sourceMappingURL=coupon-code-event.js.map