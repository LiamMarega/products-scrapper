import { QuerySearchArgs, SearchInput, SearchResponse } from '@vendure/common/lib/generated-types';
import { Omit } from '@vendure/common/lib/omit';
import { RequestContext } from '../../../api/common/request-context';
import { SearchResolver as BaseSearchResolver } from '../../../api/resolvers/admin/search.resolver';
import { Collection } from '../../../entity/collection/collection.entity';
import { FacetValue } from '../../../entity/facet-value/facet-value.entity';
import { FulltextSearchService } from '../fulltext-search.service';
import { SearchJobBufferService } from '../search-job-buffer/search-job-buffer.service';
export declare class ShopFulltextSearchResolver implements Pick<BaseSearchResolver, 'search' | 'facetValues' | 'collections'> {
    private fulltextSearchService;
    constructor(fulltextSearchService: FulltextSearchService);
    search(ctx: RequestContext, args: QuerySearchArgs): Promise<Omit<SearchResponse, 'facetValues' | 'collections'>>;
    facetValues(ctx: RequestContext, parent: {
        input: SearchInput;
    }): Promise<Array<{
        facetValue: FacetValue;
        count: number;
    }>>;
    collections(ctx: RequestContext, parent: {
        input: SearchInput;
    }): Promise<Array<{
        collection: Collection;
        count: number;
    }>>;
}
export declare class AdminFulltextSearchResolver implements BaseSearchResolver {
    private fulltextSearchService;
    private searchJobBufferService;
    constructor(fulltextSearchService: FulltextSearchService, searchJobBufferService: SearchJobBufferService);
    search(ctx: RequestContext, args: QuerySearchArgs): Promise<Omit<SearchResponse, 'facetValues' | 'collections'>>;
    facetValues(ctx: RequestContext, parent: {
        input: SearchInput;
    }): Promise<Array<{
        facetValue: FacetValue;
        count: number;
    }>>;
    collections(ctx: RequestContext, parent: {
        input: SearchInput;
    }): Promise<Array<{
        collection: Collection;
        count: number;
    }>>;
    reindex(ctx: RequestContext): Promise<import("../../..").Job<any>>;
    pendingSearchIndexUpdates(...args: any[]): Promise<any>;
    runPendingSearchIndexUpdates(...args: any[]): Promise<any>;
}
