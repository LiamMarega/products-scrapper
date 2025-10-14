"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderPercentageDiscount = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const promotion_action_1 = require("../promotion-action");
exports.orderPercentageDiscount = new promotion_action_1.PromotionOrderAction({
    code: 'order_percentage_discount',
    args: {
        discount: {
            type: 'float',
            ui: {
                component: 'number-form-input',
                suffix: '%',
            },
        },
    },
    execute(ctx, order, args) {
        const orderTotal = ctx.channel.pricesIncludeTax ? order.subTotalWithTax : order.subTotal;
        return -orderTotal * (args.discount / 100);
    },
    description: [{ languageCode: generated_types_1.LanguageCode.en, value: 'Discount order by { discount }%' }],
});
//# sourceMappingURL=order-percentage-discount-action.js.map