import { RequestContext } from '../api';
/**
 * @description
 * This service is used to cache arbitrary data relative to an ongoing request.
 * It does this by using a WeakMap bound to the current RequestContext, so the cached
 * data is available for the duration of the request. Once the request completes, the
 * cached data will be automatically garbage-collected.
 *
 * This is useful for caching data which is expensive to compute and which is needed
 * multiple times during the handling of a single request.
 *
 * @docsCategory cache
 */
export declare class RequestContextCacheService {
    private caches;
    /**
     * @description
     * Set a value in the RequestContext cache.
     */
    set<T = any>(ctx: RequestContext, key: any, val: T): void;
    /**
     * @description
     * Get a value from the RequestContext cache. If the value is not found, the `getDefault`
     * function will be called to get the value, which will then be cached and returned.
     */
    get<T = any>(ctx: RequestContext, key: any): T | undefined;
    get<T>(ctx: RequestContext, key: any, getDefault?: () => T): T;
    private getContextCache;
    private isPromise;
}
