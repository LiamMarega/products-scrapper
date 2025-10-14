"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContextCacheService = void 0;
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
class RequestContextCacheService {
    constructor() {
        this.caches = new WeakMap();
    }
    /**
     * @description
     * Set a value in the RequestContext cache.
     */
    set(ctx, key, val) {
        this.getContextCache(ctx).set(key, val);
    }
    get(ctx, key, getDefault) {
        const ctxCache = this.getContextCache(ctx);
        const result = ctxCache.get(key);
        if (result) {
            return result;
        }
        if (getDefault) {
            const defaultResultOrPromise = getDefault();
            ctxCache.set(key, defaultResultOrPromise);
            return defaultResultOrPromise;
        }
        else {
            return;
        }
    }
    getContextCache(ctx) {
        let ctxCache = this.caches.get(ctx);
        if (!ctxCache) {
            ctxCache = new Map();
            this.caches.set(ctx, ctxCache);
        }
        return ctxCache;
    }
    isPromise(input) {
        return typeof input.then === 'function';
    }
}
exports.RequestContextCacheService = RequestContextCacheService;
//# sourceMappingURL=request-context-cache.service.js.map