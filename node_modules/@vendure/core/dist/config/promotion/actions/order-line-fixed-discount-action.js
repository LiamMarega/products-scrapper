"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderLineFixedDiscount = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const promotion_action_1 = require("../promotion-action");
exports.orderLineFixedDiscount = new promotion_action_1.PromotionLineAction({
    code: 'order_line_fixed_discount',
    args: {
        discount: {
            type: 'int',
            ui: {
                component: 'currency-form-input',
            },
        },
    },
    execute(ctx, orderLine, args) {
        return -args.discount;
    },
    description: [{ languageCode: generated_types_1.LanguageCode.en, value: 'Discount orderLine by fixed amount' }],
});
//# sourceMappingURL=order-line-fixed-discount-action.js.map