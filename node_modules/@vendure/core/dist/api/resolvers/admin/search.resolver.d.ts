import { SearchResponse } from '@vendure/common/lib/generated-types';
import { Omit } from '@vendure/common/lib/omit';
import { Collection, FacetValue } from '../../../entity';
export declare class SearchResolver {
    search(...args: any): Promise<Omit<SearchResponse, 'facetValues' | 'collections'>>;
    facetValues(...args: any[]): Promise<Array<{
        facetValue: FacetValue;
        count: number;
    }>>;
    collections(...args: any[]): Promise<Array<{
        collection: Collection;
        count: number;
    }>>;
    reindex(...args: any[]): Promise<any>;
    pendingSearchIndexUpdates(...args: any[]): Promise<any>;
    runPendingSearchIndexUpdates(...args: any[]): Promise<any>;
}
