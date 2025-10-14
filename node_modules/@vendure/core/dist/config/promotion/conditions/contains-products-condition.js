"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.containsProducts = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const utils_1 = require("../../../common/utils");
const promotion_condition_1 = require("../promotion-condition");
exports.containsProducts = new promotion_condition_1.PromotionCondition({
    code: 'contains_products',
    description: [
        { languageCode: generated_types_1.LanguageCode.en, value: 'Buy at least { minimum } of the specified products' },
    ],
    args: {
        minimum: {
            type: 'int',
            defaultValue: 1,
        },
        productVariantIds: {
            type: 'ID',
            list: true,
            ui: { component: 'product-selector-form-input' },
            label: [{ languageCode: generated_types_1.LanguageCode.en, value: 'Product variants' }],
        },
    },
    async check(ctx, order, args) {
        const ids = args.productVariantIds;
        let matches = 0;
        for (const line of order.lines) {
            if (lineContainsIds(ids, line)) {
                matches += line.quantity;
            }
        }
        return args.minimum <= matches;
    },
});
function lineContainsIds(ids, line) {
    return !!ids.find(id => (0, utils_1.idsAreEqual)(id, line.productVariant.id));
}
//# sourceMappingURL=contains-products-condition.js.map