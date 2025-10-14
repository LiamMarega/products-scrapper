import { JsonCompatible } from '@vendure/common/lib/shared-types';
import { CacheTtlProvider } from '../../cache/cache-ttl-provider';
import { CacheStrategy, SetCacheKeyOptions } from './cache-strategy';
export interface CacheItem<T> {
    value: JsonCompatible<T>;
    expires?: number;
}
/**
 * A {@link CacheStrategy} that stores the cache in memory using a simple
 * JavaScript Map.
 *
 * This is the default strategy that will be used if no other strategy is
 * configured.
 *
 * **Caution** do not use this in a multi-instance deployment because
 * cache invalidation will not propagate to other instances.
 *
 * @since 3.1.0
 */
export declare class InMemoryCacheStrategy implements CacheStrategy {
    protected cache: Map<string, CacheItem<any>>;
    protected cacheTags: Map<string, Set<string>>;
    protected cacheSize: number;
    protected ttlProvider: CacheTtlProvider;
    constructor(config?: {
        cacheSize?: number;
        cacheTtlProvider?: CacheTtlProvider;
    });
    get<T extends JsonCompatible<T>>(key: string): Promise<T | undefined>;
    set<T extends JsonCompatible<T>>(key: string, value: T, options?: SetCacheKeyOptions): Promise<void>;
    delete(key: string): Promise<void>;
    invalidateTags(tags: string[]): Promise<void>;
    private first;
}
