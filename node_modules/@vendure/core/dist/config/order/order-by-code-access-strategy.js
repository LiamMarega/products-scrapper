"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultOrderByCodeAccessStrategy = void 0;
const ms_1 = __importDefault(require("ms"));
/**
 * @description
 * The default OrderByCodeAccessStrategy used by Vendure. It permitts permanent access to
 * the Customer owning the Order and anyone within a given time period after placing the Order
 * (defaults to 2h).
 *
 * @param anonymousAccessDuration value for [ms](https://github.com/vercel/ms), e.g. `2h` for 2 hours or `5d` for 5 days
 *
 * @docsCategory orders
 * @docsPage OrderByCodeAccessStrategy
 */
class DefaultOrderByCodeAccessStrategy {
    constructor(anonymousAccessDuration) {
        this.anonymousAccessDuration = anonymousAccessDuration;
    }
    canAccessOrder(ctx, order) {
        var _a, _b;
        // Order owned by active user
        const activeUserMatches = ((_b = (_a = order === null || order === void 0 ? void 0 : order.customer) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id) === ctx.activeUserId;
        // For guest Customers, allow access to the Order for the following
        // time period
        const anonymousAccessPermitted = () => {
            const anonymousAccessLimit = (0, ms_1.default)(this.anonymousAccessDuration);
            const orderPlaced = order.orderPlacedAt ? +order.orderPlacedAt : 0;
            const now = Date.now();
            return now - orderPlaced < anonymousAccessLimit;
        };
        return (ctx.activeUserId && activeUserMatches) || (!ctx.activeUserId && anonymousAccessPermitted());
    }
}
exports.DefaultOrderByCodeAccessStrategy = DefaultOrderByCodeAccessStrategy;
//# sourceMappingURL=order-by-code-access-strategy.js.map