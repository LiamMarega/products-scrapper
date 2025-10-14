import { CachedSession, SessionCacheStrategy } from './session-cache-strategy';
/**
 * @description
 * Caches session in memory, using a LRU cache implementation. Not suitable for
 * multi-server setups since the cache will be local to each instance, reducing
 * its effectiveness. By default the cache has a size of 1000, meaning that after
 * 1000 sessions have been cached, any new sessions will cause the least-recently-used
 * session to be evicted (removed) from the cache.
 *
 * The cache size can be configured by passing a different number to the constructor
 * function.
 *
 * @docsCategory auth
 */
export declare class InMemorySessionCacheStrategy implements SessionCacheStrategy {
    private readonly cache;
    private readonly cacheSize;
    constructor(cacheSize?: number);
    delete(sessionToken: string): void;
    get(sessionToken: string): CachedSession | undefined;
    set(session: CachedSession): void;
    clear(): void;
    private first;
}
