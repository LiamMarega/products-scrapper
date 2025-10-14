"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderFixedDiscount = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const promotion_action_1 = require("../promotion-action");
exports.orderFixedDiscount = new promotion_action_1.PromotionOrderAction({
    code: 'order_fixed_discount',
    args: {
        discount: {
            type: 'int',
            ui: {
                component: 'currency-form-input',
            },
        },
    },
    execute(ctx, order, args) {
        const upperBound = ctx.channel.pricesIncludeTax ? order.subTotalWithTax : order.subTotal;
        return -Math.min(args.discount, upperBound);
    },
    description: [{ languageCode: generated_types_1.LanguageCode.en, value: 'Discount order by fixed amount' }],
});
//# sourceMappingURL=order-fixed-discount-action.js.map