import { LanguageCode } from '@vendure/common/lib/generated-types';
import { EntityDuplicator } from '../entity-duplicator';
/**
 * @description
 * Duplicates a Facet
 */
export declare const facetDuplicator: EntityDuplicator<{
    includeFacetValues: {
        type: "boolean";
        defaultValue: true;
        label: {
            languageCode: LanguageCode.en;
            value: string;
        }[];
    };
}>;
