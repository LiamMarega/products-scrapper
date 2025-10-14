import { LanguageCode } from '@vendure/common/lib/generated-types';
import { EntityDuplicator } from '../entity-duplicator';
/**
 * @description
 * Duplicates a Product and its associated ProductVariants.
 */
export declare const productDuplicator: EntityDuplicator<{
    includeVariants: {
        type: "boolean";
        defaultValue: true;
        label: {
            languageCode: LanguageCode.en;
            value: string;
        }[];
    };
}>;
