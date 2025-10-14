import { LanguageCode } from '@vendure/common/lib/generated-types';
import { ConfigArgDef } from '../../common/configurable-operation';
import { CollectionFilter } from './collection-filter';
/**
 * @description
 * Used to created unique key names for DB query parameters, to avoid conflicts if the
 * same filter is applied multiple times.
 */
export declare function randomSuffix(prefix: string): string;
/**
 * @description
 * Add this to your CollectionFilter `args` object to display the standard UI component
 * for selecting the combination mode when working with multiple filters.
 */
export declare const combineWithAndArg: ConfigArgDef<'boolean'>;
/**
 * Filters for ProductVariants having the given facetValueIds (including parent Product)
 */
export declare const facetValueCollectionFilter: CollectionFilter<{
    facetValueIds: {
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
    containsAny: {
        type: "boolean";
        label: {
            languageCode: LanguageCode.en;
            value: string;
        }[];
        description: {
            languageCode: LanguageCode.en;
            value: string;
        }[];
    };
    combineWithAnd: import("../../common/configurable-operation").ConfigArgCommonDef<"boolean"> & import("../../common/configurable-operation").WithArgConfig<never>;
}>;
export declare const variantNameCollectionFilter: CollectionFilter<{
    operator: {
        type: "string";
        ui: {
            component: string;
            options: {
                value: string;
            }[];
        };
    };
    term: {
        type: "string";
    };
    combineWithAnd: import("../../common/configurable-operation").ConfigArgCommonDef<"boolean"> & import("../../common/configurable-operation").WithArgConfig<never>;
}>;
export declare const variantIdCollectionFilter: CollectionFilter<{
    variantIds: {
        type: "ID";
        list: true;
        label: {
            languageCode: LanguageCode.en;
            value: string;
        }[];
        ui: {
            component: string;
            selectionMode: string;
        };
    };
    combineWithAnd: import("../../common/configurable-operation").ConfigArgCommonDef<"boolean"> & import("../../common/configurable-operation").WithArgConfig<never>;
}>;
export declare const productIdCollectionFilter: CollectionFilter<{
    productIds: {
        type: "ID";
        list: true;
        label: {
            languageCode: LanguageCode.en;
            value: string;
        }[];
        ui: {
            component: string;
            selectionMode: string;
        };
    };
    combineWithAnd: import("../../common/configurable-operation").ConfigArgCommonDef<"boolean"> & import("../../common/configurable-operation").WithArgConfig<never>;
}>;
export declare const defaultCollectionFilters: (CollectionFilter<{
    facetValueIds: {
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
    containsAny: {
        type: "boolean";
        label: {
            languageCode: LanguageCode.en;
            value: string;
        }[];
        description: {
            languageCode: LanguageCode.en;
            value: string;
        }[];
    };
    combineWithAnd: import("../../common/configurable-operation").ConfigArgCommonDef<"boolean"> & import("../../common/configurable-operation").WithArgConfig<never>;
}> | CollectionFilter<{
    operator: {
        type: "string";
        ui: {
            component: string;
            options: {
                value: string;
            }[];
        };
    };
    term: {
        type: "string";
    };
    combineWithAnd: import("../../common/configurable-operation").ConfigArgCommonDef<"boolean"> & import("../../common/configurable-operation").WithArgConfig<never>;
}> | CollectionFilter<{
    variantIds: {
        type: "ID";
        list: true;
        label: {
            languageCode: LanguageCode.en;
            value: string;
        }[];
        ui: {
            component: string;
            selectionMode: string;
        };
    };
    combineWithAnd: import("../../common/configurable-operation").ConfigArgCommonDef<"boolean"> & import("../../common/configurable-operation").WithArgConfig<never>;
}> | CollectionFilter<{
    productIds: {
        type: "ID";
        list: true;
        label: {
            languageCode: LanguageCode.en;
            value: string;
        }[];
        ui: {
            component: string;
            selectionMode: string;
        };
    };
    combineWithAnd: import("../../common/configurable-operation").ConfigArgCommonDef<"boolean"> & import("../../common/configurable-operation").WithArgConfig<never>;
}>)[];
