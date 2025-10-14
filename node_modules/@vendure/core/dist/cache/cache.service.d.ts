import { JsonCompatible } from '@vendure/common/lib/shared-types';
import { ConfigService } from '../config/config.service';
import { CacheStrategy, SetCacheKeyOptions } from '../config/system/cache-strategy';
import { Cache, CacheConfig } from './cache';
/**
 * @description
 * The CacheService is used to cache data in order to optimize performance.
 *
 * Internally it makes use of the configured {@link CacheStrategy} to persist
 * the cache into a key-value store.
 *
 * @since 3.1.0
 * @docsCategory cache
 */
export declare class CacheService {
    private configService;
    protected cacheStrategy: CacheStrategy;
    constructor(configService: ConfigService);
    /**
     * @description
     * Creates a new {@link Cache} instance with the given configuration.
     *
     * The `Cache` instance provides a convenience wrapper around the `CacheService`
     * methods.
     */
    createCache(config: CacheConfig): Cache;
    /**
     * @description
     * Gets an item from the cache, or returns undefined if the key is not found, or the
     * item has expired.
     */
    get<T extends JsonCompatible<T>>(key: string): Promise<T | undefined>;
    /**
     * @description
     * Sets a key-value pair in the cache. The value must be serializable, so cannot contain
     * things like functions, circular data structures, class instances etc.
     *
     * Optionally a "time to live" (ttl) can be specified, which means that the key will
     * be considered stale after that many milliseconds.
     */
    set<T extends JsonCompatible<T>>(key: string, value: T, options?: SetCacheKeyOptions): Promise<void>;
    /**
     * @description
     * Deletes an item from the cache.
     */
    delete(key: string): Promise<void>;
    /**
     * @description
     * Deletes all items from the cache which contain at least one matching tag.
     */
    invalidateTags(tags: string[]): Promise<void>;
}
