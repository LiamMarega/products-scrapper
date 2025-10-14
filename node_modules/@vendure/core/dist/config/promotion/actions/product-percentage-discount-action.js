"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsPercentageDiscount = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const utils_1 = require("../../../common/utils");
const promotion_action_1 = require("../promotion-action");
exports.productsPercentageDiscount = new promotion_action_1.PromotionItemAction({
    code: 'products_percentage_discount',
    description: [{ languageCode: generated_types_1.LanguageCode.en, value: 'Discount specified products by { discount }%' }],
    args: {
        discount: {
            type: 'float',
            ui: {
                component: 'number-form-input',
                suffix: '%',
            },
        },
        productVariantIds: {
            type: 'ID',
            list: true,
            ui: { component: 'product-selector-form-input' },
            label: [{ languageCode: generated_types_1.LanguageCode.en, value: 'Product variants' }],
        },
    },
    execute(ctx, orderLine, args) {
        if (lineContainsIds(args.productVariantIds, orderLine)) {
            const unitPrice = ctx.channel.pricesIncludeTax ? orderLine.unitPriceWithTax : orderLine.unitPrice;
            return -unitPrice * (args.discount / 100);
        }
        return 0;
    },
});
function lineContainsIds(ids, line) {
    return !!ids.find(id => (0, utils_1.idsAreEqual)(id, line.productVariant.id));
}
//# sourceMappingURL=product-percentage-discount-action.js.map