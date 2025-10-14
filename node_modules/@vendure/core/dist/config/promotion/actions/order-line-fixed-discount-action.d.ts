import { PromotionLineAction } from '../promotion-action';
export declare const orderLineFixedDiscount: PromotionLineAction<{
    discount: {
        type: "int";
        ui: {
            component: string;
        };
    };
}, []>;
