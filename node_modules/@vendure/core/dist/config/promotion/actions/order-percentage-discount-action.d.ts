import { PromotionOrderAction } from '../promotion-action';
export declare const orderPercentageDiscount: PromotionOrderAction<{
    discount: {
        type: "float";
        ui: {
            component: string;
            suffix: string;
        };
    };
}, []>;
