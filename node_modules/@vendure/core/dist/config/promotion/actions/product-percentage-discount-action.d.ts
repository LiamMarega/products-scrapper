import { LanguageCode } from '@vendure/common/lib/generated-types';
import { PromotionItemAction } from '../promotion-action';
export declare const productsPercentageDiscount: PromotionItemAction<{
    discount: {
        type: "float";
        ui: {
            component: string;
            suffix: string;
        };
    };
    productVariantIds: {
        type: "ID";
        list: true;
        ui: {
            component: string;
        };
        label: {
            languageCode: LanguageCode.en;
            value: string;
        }[];
    };
}, []>;
