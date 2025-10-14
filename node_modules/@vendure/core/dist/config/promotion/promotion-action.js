"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionShippingAction = exports.PromotionOrderAction = exports.PromotionLineAction = exports.PromotionItemAction = exports.PromotionAction = void 0;
const pick_1 = require("@vendure/common/lib/pick");
const configurable_operation_1 = require("../../common/configurable-operation");
/**
 * @description
 * An abstract class which is extended by {@link PromotionItemAction}, {@link PromotionOrderAction},
 * and {@link PromotionShippingAction}.
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 * @docsWeight 0
 */
class PromotionAction extends configurable_operation_1.ConfigurableOperationDef {
    constructor(config) {
        super(config);
        this.priorityValue = config.priorityValue || 0;
        this.conditions = config.conditions;
        this.onActivateFn = config.onActivate;
        this.onDeactivateFn = config.onDeactivate;
    }
    /** @internal */
    onActivate(ctx, order, args, promotion) {
        var _a;
        return (_a = this.onActivateFn) === null || _a === void 0 ? void 0 : _a.call(this, ctx, order, this.argsArrayToHash(args), promotion);
    }
    /** @internal */
    onDeactivate(ctx, order, args, promotion) {
        var _a;
        return (_a = this.onDeactivateFn) === null || _a === void 0 ? void 0 : _a.call(this, ctx, order, this.argsArrayToHash(args), promotion);
    }
}
exports.PromotionAction = PromotionAction;
/**
 * @description
 * Represents a PromotionAction which applies to individual {@link OrderLine}s.
 *
 * @example
 * ```ts
 * // Applies a percentage discount to each OrderLine
 * const itemPercentageDiscount = new PromotionItemAction({
 *     code: 'item_percentage_discount',
 *     args: { discount: 'percentage' },
 *     execute(ctx, orderLine, args) {
 *         return -orderLine.unitPrice * (args.discount / 100);
 *     },
 *     description: 'Discount every item by { discount }%',
 * });
 * ```
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 * @docsWeight 1
 */
class PromotionItemAction extends PromotionAction {
    constructor(config) {
        super(config);
        this.executeFn = config.execute;
    }
    /** @internal */
    execute(ctx, orderLine, args, state, promotion) {
        const actionState = this.conditions
            ? (0, pick_1.pick)(state, this.conditions.map(c => c.code))
            : {};
        return this.executeFn(ctx, orderLine, this.argsArrayToHash(args), actionState, promotion);
    }
}
exports.PromotionItemAction = PromotionItemAction;
/**
 * @description
 * Represents a PromotionAction which applies to individual {@link OrderLine}s.
 * The difference from PromotionItemAction is that it applies regardless of the Quantity of the OrderLine.
 *
 * @example
 * ```ts
 * // Applies a percentage discount to each OrderLine
 * const linePercentageDiscount = new PromotionLineAction({
 *     code: 'line_percentage_discount',
 *     args: { discount: 'percentage' },
 *     execute(ctx, orderLine, args) {
 *         return -orderLine.linePrice * (args.discount / 100);
 *     },
 *     description: 'Discount every line by { discount }%',
 * });
 * ```
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 */
class PromotionLineAction extends PromotionAction {
    constructor(config) {
        super(config);
        this.executeFn = config.execute;
    }
    /** @internal */
    execute(ctx, orderLine, args, state, promotion) {
        const actionState = this.conditions
            ? (0, pick_1.pick)(state, this.conditions.map(c => c.code))
            : {};
        return this.executeFn(ctx, orderLine, this.argsArrayToHash(args), actionState, promotion);
    }
}
exports.PromotionLineAction = PromotionLineAction;
/**
 * @description
 * Represents a PromotionAction which applies to the {@link Order} as a whole.
 *
 * @example
 * ```ts
 * // Applies a percentage discount to the entire Order
 * const orderPercentageDiscount = new PromotionOrderAction({
 *     code: 'order_percentage_discount',
 *     args: { discount: 'percentage' },
 *     execute(ctx, order, args) {
 *         return -order.subTotal * (args.discount / 100);
 *     },
 *     description: 'Discount order by { discount }%',
 * });
 * ```
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 * @docsWeight 2
 */
class PromotionOrderAction extends PromotionAction {
    constructor(config) {
        super(config);
        this.executeFn = config.execute;
    }
    /** @internal */
    execute(ctx, order, args, state, promotion) {
        const actionState = this.conditions
            ? (0, pick_1.pick)(state, this.conditions.map(c => c.code))
            : {};
        return this.executeFn(ctx, order, this.argsArrayToHash(args), actionState, promotion);
    }
}
exports.PromotionOrderAction = PromotionOrderAction;
/**
 * @description
 * Represents a PromotionAction which applies to the shipping cost of an Order.
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 * @docsWeight 3
 */
class PromotionShippingAction extends PromotionAction {
    constructor(config) {
        super(config);
        this.executeFn = config.execute;
    }
    /** @internal */
    execute(ctx, shippingLine, order, args, state, promotion) {
        const actionState = this.conditions
            ? (0, pick_1.pick)(state, this.conditions.map(c => c.code))
            : {};
        return this.executeFn(ctx, shippingLine, order, this.argsArrayToHash(args), actionState, promotion);
    }
}
exports.PromotionShippingAction = PromotionShippingAction;
//# sourceMappingURL=promotion-action.js.map