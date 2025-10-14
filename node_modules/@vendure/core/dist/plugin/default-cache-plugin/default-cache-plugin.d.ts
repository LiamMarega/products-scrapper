import { CacheTtlProvider } from '../../cache/cache-ttl-provider';
/**
 * @description
 * Configuration options for the {@link DefaultCachePlugin}.
 *
 * @docsCategory cache
 * @docsPage DefaultCachePlugin
 * @since 3.1.0
 */
export interface DefaultCachePluginInitOptions {
    /**
     * @description
     * The maximum number of items to store in the cache. Once the cache reaches this size,
     * the least-recently-used items will be evicted to make room for new items.
     *
     * @default 10_000
     */
    cacheSize?: number;
    /**
     * @description
     * Optionally provide a custom CacheTtlProvider to control the TTL of cache items.
     * This is useful for testing.
     */
    cacheTtlProvider?: CacheTtlProvider;
}
/**
 * @description
 * This plugin provides a simple SQL-based cache strategy {@link SqlCacheStrategy} which stores cached
 * items in the database.
 *
 * It is suitable for production use (including multi-instance setups). For increased performance
 * you can also consider using the {@link RedisCachePlugin}.
 *
 * @docsCategory cache
 * @docsPage DefaultCachePlugin
 * @docsWeight 0
 * @since 3.1.0
 */
export declare class DefaultCachePlugin {
    static options: DefaultCachePluginInitOptions;
    static init(options: DefaultCachePluginInitOptions): typeof DefaultCachePlugin;
}
