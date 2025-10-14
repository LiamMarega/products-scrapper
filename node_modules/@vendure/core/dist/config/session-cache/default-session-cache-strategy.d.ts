import { CacheService } from '../../cache/index';
import { Injector } from '../../common/injector';
import { CachedSession, SessionCacheStrategy } from './session-cache-strategy';
/**
 * @description
 * The default {@link SessionCacheStrategy} delegates to the configured
 * {@link CacheStrategy} to store the session data. This should be suitable
 * for most use-cases, assuming you select a suitable {@link CacheStrategy}
 *
 * @since 3.1.0
 * @docsCategory auth
 */
export declare class DefaultSessionCacheStrategy implements SessionCacheStrategy {
    private options?;
    protected cacheService: CacheService;
    private readonly tags;
    constructor(options?: {
        ttl?: number;
        cachePrefix?: string;
    } | undefined);
    init(injector: Injector): void;
    set(session: CachedSession): Promise<void>;
    get(sessionToken: string): Promise<CachedSession | undefined>;
    delete(sessionToken: string): void | Promise<void>;
    clear(): Promise<void>;
    /**
     * @description
     * The `CachedSession` interface includes a `Date` object, which we need to
     * manually serialize/deserialize to/from JSON.
     */
    private serializeDates;
    private deserializeDates;
    private getCacheKey;
}
