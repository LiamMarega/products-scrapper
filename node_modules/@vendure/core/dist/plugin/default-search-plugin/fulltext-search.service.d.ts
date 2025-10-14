import { SearchInput, SearchResponse } from '@vendure/common/lib/generated-types';
import { Omit } from '@vendure/common/lib/omit';
import { RequestContext } from '../../api/common/request-context';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Collection, FacetValue } from '../../entity';
import { EventBus } from '../../event-bus/event-bus';
import { Job } from '../../job-queue/job';
import { CollectionService } from '../../service/services/collection.service';
import { FacetValueService } from '../../service/services/facet-value.service';
import { ProductVariantService } from '../../service/services/product-variant.service';
import { SearchService } from '../../service/services/search.service';
import { SearchIndexService } from './indexer/search-index.service';
import { SearchStrategy } from './search-strategy/search-strategy';
import { DefaultSearchPluginInitOptions } from './types';
/**
 * Search indexing and full-text search for supported databases. See the various
 * SearchStrategy implementations for db-specific code.
 */
export declare class FulltextSearchService {
    private connection;
    private eventBus;
    private facetValueService;
    private collectionService;
    private productVariantService;
    private searchIndexService;
    private searchService;
    private options;
    private _searchStrategy;
    private readonly minTermLength;
    constructor(connection: TransactionalConnection, eventBus: EventBus, facetValueService: FacetValueService, collectionService: CollectionService, productVariantService: ProductVariantService, searchIndexService: SearchIndexService, searchService: SearchService, options: DefaultSearchPluginInitOptions);
    /**
     * Perform a fulltext search according to the provided input arguments.
     */
    search(ctx: RequestContext, input: SearchInput, enabledOnly?: boolean): Promise<Omit<Omit<SearchResponse, 'facetValues'>, 'collections'>>;
    /**
     * Return a list of all FacetValues which appear in the result set.
     */
    facetValues(ctx: RequestContext, input: SearchInput, enabledOnly?: boolean): Promise<Array<{
        facetValue: FacetValue;
        count: number;
    }>>;
    /**
     * Return a list of all Collections which appear in the result set.
     */
    collections(ctx: RequestContext, input: SearchInput, enabledOnly?: boolean): Promise<Array<{
        collection: Collection;
        count: number;
    }>>;
    /**
     * Rebuilds the full search index.
     */
    reindex(ctx: RequestContext): Promise<Job>;
    /**
     * Sets the SearchStrategy appropriate to th configured database type.
     */
    private setSearchStrategy;
    get searchStrategy(): SearchStrategy;
}
