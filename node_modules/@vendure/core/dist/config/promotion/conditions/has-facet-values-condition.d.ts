import { PromotionCondition } from '../promotion-condition';
export declare const hasFacetValues: PromotionCondition<{
    minimum: {
        type: "int";
        defaultValue: number;
    };
    facets: {
        type: "ID";
        list: true;
        ui: {
            component: string;
        };
    };
}, "at_least_n_with_facets", boolean>;
