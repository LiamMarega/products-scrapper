/**
 * @description
 * An in-memory cache with a configurable TTL (time to live) which means cache items
 * expire after they have been in the cache longer than that time.
 *
 * The `ttl` config option is in milliseconds. Defaults to 30 seconds TTL and a cache size of 1000.
 *
 * @deprecated Use the CacheService instead
 */
export declare class TtlCache<K, V> {
    private cache;
    private readonly ttl;
    private readonly cacheSize;
    constructor(config?: {
        ttl?: number;
        cacheSize?: number;
    });
    get(key: K): V | undefined;
    set(key: K, value: V): void;
    delete(key: K): void;
    private first;
}
