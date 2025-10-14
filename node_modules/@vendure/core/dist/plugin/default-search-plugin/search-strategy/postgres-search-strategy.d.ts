import { SearchResult } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../../api/common/request-context';
import { Injector } from '../../../common';
import { SearchInput } from '../types';
import { SearchStrategy } from './search-strategy';
/**
 * @description A weighted fulltext search for PostgeSQL.
 *
 * @docsCategory DefaultSearchPlugin
 */
export declare class PostgresSearchStrategy implements SearchStrategy {
    private readonly minTermLength;
    private connection;
    private options;
    init(injector: Injector): Promise<void>;
    getFacetValueIds(ctx: RequestContext, input: SearchInput, enabledOnly: boolean): Promise<Map<ID, number>>;
    getCollectionIds(ctx: RequestContext, input: SearchInput, enabledOnly: boolean): Promise<Map<ID, number>>;
    getSearchResults(ctx: RequestContext, input: SearchInput, enabledOnly: boolean): Promise<SearchResult[]>;
    getTotalCount(ctx: RequestContext, input: SearchInput, enabledOnly: boolean): Promise<number>;
    private applyTermAndFilters;
    /**
     * When a select statement includes a GROUP BY clause,
     * then all selected columns must be aggregated. So we just apply the
     * "MIN" function in this case to all other columns than the productId.
     */
    private createPostgresSelect;
}
