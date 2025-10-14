"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyXGetYFreeAction = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const buy_x_get_y_free_condition_1 = require("../conditions/buy-x-get-y-free-condition");
const promotion_action_1 = require("../promotion-action");
exports.buyXGetYFreeAction = new promotion_action_1.PromotionItemAction({
    code: 'buy_x_get_y_free',
    description: [
        {
            languageCode: generated_types_1.LanguageCode.en,
            value: 'Buy X products, get Y products free',
        },
    ],
    args: {},
    conditions: [buy_x_get_y_free_condition_1.buyXGetYFreeCondition],
    execute(ctx, orderLine, args, state) {
        const freeItemsPerLine = state.buy_x_get_y_free.freeItemsPerLine;
        const freeQuantity = freeItemsPerLine[orderLine.id];
        if (freeQuantity) {
            const unitPrice = ctx.channel.pricesIncludeTax ? orderLine.unitPriceWithTax : orderLine.unitPrice;
            return -unitPrice * (freeQuantity / orderLine.quantity);
        }
        return 0;
    },
});
//# sourceMappingURL=buy-x-get-y-free-action.js.map