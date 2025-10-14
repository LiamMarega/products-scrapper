"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyXGetYFreeCondition = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const promotion_condition_1 = require("../promotion-condition");
exports.buyXGetYFreeCondition = new promotion_condition_1.PromotionCondition({
    code: 'buy_x_get_y_free',
    description: [
        {
            languageCode: generated_types_1.LanguageCode.en,
            value: 'Buy X products, get Y products free',
        },
    ],
    args: {
        amountX: {
            type: 'int',
            defaultValue: 2,
        },
        variantIdsX: {
            type: 'ID',
            list: true,
            ui: { component: 'product-selector-form-input' },
            label: [{ languageCode: generated_types_1.LanguageCode.en, value: 'Buy amountX of these variants' }],
        },
        amountY: {
            type: 'int',
            defaultValue: 1,
        },
        variantIdsY: {
            type: 'ID',
            list: true,
            ui: { component: 'product-selector-form-input' },
            label: [{ languageCode: generated_types_1.LanguageCode.en, value: 'Get amountY of these variants for free' }],
        },
    },
    async check(ctx, order, args) {
        const xIds = createIdentityMap(args.variantIdsX);
        const yIds = createIdentityMap(args.variantIdsY);
        let matches = 0;
        const freeItemCandidates = [];
        for (const line of order.lines) {
            const variantId = line.productVariant.id;
            if (variantId in xIds) {
                matches += line.quantity;
            }
            if (variantId in yIds) {
                freeItemCandidates.push(line);
            }
        }
        const quantity = Math.floor(matches / args.amountX);
        if (!quantity || !freeItemCandidates.length)
            return false;
        const freeLines = freeItemCandidates.sort((a, b) => {
            const unitPriceA = ctx.channel.pricesIncludeTax ? a.unitPriceWithTax : a.unitPrice;
            const unitPriceB = ctx.channel.pricesIncludeTax ? b.unitPriceWithTax : b.unitPrice;
            if (unitPriceA < unitPriceB)
                return -1;
            if (unitPriceA > unitPriceB)
                return 1;
            return 0;
        });
        let placesToAllocate = args.amountY;
        const freeItemsPerLine = {};
        for (const freeLine of freeLines) {
            if (placesToAllocate === 0)
                break;
            const freeQuantity = Math.min(freeLine.quantity, placesToAllocate);
            freeItemsPerLine[freeLine.id] = freeQuantity;
            placesToAllocate -= freeQuantity;
        }
        return { freeItemsPerLine };
    },
});
function createIdentityMap(ids) {
    return ids.reduce((map, id) => (Object.assign(Object.assign({}, map), { [id]: id })), {});
}
//# sourceMappingURL=buy-x-get-y-free-condition.js.map