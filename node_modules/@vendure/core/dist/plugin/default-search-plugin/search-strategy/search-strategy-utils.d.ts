import { CurrencyCode, LanguageCode, SearchResult } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { SelectQueryBuilder } from 'typeorm';
import { SearchIndexItem } from '../entities/search-index-item.entity';
/**
 * Maps a raw database result to a SearchResult.
 */
export declare function mapToSearchResult(raw: any, currencyCode: CurrencyCode): SearchResult;
/**
 * Given the raw query results containing rows with a `facetValues` property line "1,2,1,2",
 * this function returns a map of FacetValue ids => count of how many times they occur.
 */
export declare function createFacetIdCountMap(facetValuesResult: Array<{
    facetValues: string;
}>): Map<ID, number>;
/**
 * Given the raw query results containing rows with a `collections` property line "1,2,1,2",
 * this function returns a map of Collection ids => count of how many times they occur.
 */
export declare function createCollectionIdCountMap(collectionsResult: Array<{
    collections: string;
}>): Map<ID, number>;
export declare function createPlaceholderFromId(id: ID): string;
/**
 * Applies language constraints for {@link SearchIndexItem} query.
 *
 * @param qb QueryBuilder instance
 * @param languageCode Preferred language code
 * @param defaultLanguageCode Default language code that is used if {@link SearchIndexItem} is not available in preferred language
 */
export declare function applyLanguageConstraints(qb: SelectQueryBuilder<SearchIndexItem>, languageCode: LanguageCode, defaultLanguageCode: LanguageCode): SelectQueryBuilder<SearchIndexItem>;
