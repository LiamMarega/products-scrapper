"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionCondition = void 0;
const configurable_operation_1 = require("../../common/configurable-operation");
/**
 * @description
 * PromotionConditions are used to create {@link Promotion}s. The purpose of a PromotionCondition
 * is to check the order against a particular predicate function (the `check` function) and to return
 * `true` if the Order satisfies the condition, or `false` if it does not.
 *
 * @docsCategory promotions
 * @docsPage promotion-condition
 * @docsWeight 0
 */
class PromotionCondition extends configurable_operation_1.ConfigurableOperationDef {
    get code() {
        return super.code;
    }
    constructor(config) {
        super(config);
        this.checkFn = config.check;
        this.priorityValue = config.priorityValue || 0;
    }
    /**
     * @description
     * This is the function which contains the conditional logic to decide whether
     * a Promotion should apply to an Order. See {@link CheckPromotionConditionFn}.
     */
    async check(ctx, order, args, promotion) {
        return this.checkFn(ctx, order, this.argsArrayToHash(args), promotion);
    }
}
exports.PromotionCondition = PromotionCondition;
//# sourceMappingURL=promotion-condition.js.map