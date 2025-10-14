import { SearchResult } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../../api/common/request-context';
import { Injector } from '../../../common';
import { SearchInput } from '../types';
import { SearchStrategy } from './search-strategy';
/**
 *
 * @description
 * A rather naive search for SQLite / SQL.js. Rather than proper
 * full-text searching, it uses a weighted `LIKE "%term%"` operator instead.
 *
 * @docsCategory DefaultSearchPlugin
 */
export declare class SqliteSearchStrategy implements SearchStrategy {
    private readonly minTermLength;
    private connection;
    private options;
    init(injector: Injector): Promise<void>;
    getFacetValueIds(ctx: RequestContext, input: SearchInput, enabledOnly: boolean): Promise<Map<ID, number>>;
    getCollectionIds(ctx: RequestContext, input: SearchInput, enabledOnly: boolean): Promise<Map<ID, number>>;
    getSearchResults(ctx: RequestContext, input: SearchInput, enabledOnly: boolean): Promise<SearchResult[]>;
    getTotalCount(ctx: RequestContext, input: SearchInput, enabledOnly: boolean): Promise<number>;
    private applyTermAndFilters;
}
