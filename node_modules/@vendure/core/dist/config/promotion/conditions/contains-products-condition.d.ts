import { LanguageCode } from '@vendure/common/lib/generated-types';
import { PromotionCondition } from '../promotion-condition';
export declare const containsProducts: PromotionCondition<{
    minimum: {
        type: "int";
        defaultValue: number;
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
}, "contains_products", boolean>;
