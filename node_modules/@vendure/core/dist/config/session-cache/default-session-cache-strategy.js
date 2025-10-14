"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultSessionCacheStrategy = void 0;
const index_1 = require("../../cache/index");
/**
 * @description
 * The default {@link SessionCacheStrategy} delegates to the configured
 * {@link CacheStrategy} to store the session data. This should be suitable
 * for most use-cases, assuming you select a suitable {@link CacheStrategy}
 *
 * @since 3.1.0
 * @docsCategory auth
 */
class DefaultSessionCacheStrategy {
    constructor(options) {
        this.options = options;
        this.tags = ['DefaultSessionCacheStrategy'];
    }
    init(injector) {
        this.cacheService = injector.get(index_1.CacheService);
    }
    set(session) {
        var _a, _b;
        return this.cacheService.set(this.getCacheKey(session.token), this.serializeDates(session), {
            tags: this.tags,
            ttl: (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.ttl) !== null && _b !== void 0 ? _b : 24 * 60 * 60 * 1000,
        });
    }
    async get(sessionToken) {
        const cacheKey = this.getCacheKey(sessionToken);
        const item = await this.cacheService.get(cacheKey);
        return item ? this.deserializeDates(item) : undefined;
    }
    delete(sessionToken) {
        return this.cacheService.delete(this.getCacheKey(sessionToken));
    }
    clear() {
        var _a;
        // We use the `?` here because there is a case where in the SessionService,
        // the clearSessionCacheOnDataChange() method may be invoked during bootstrap prior to
        // the cacheService being initialized in the `init()` method above.
        // This is an edge-case limited to seeding initial data as in e2e tests or a
        // @vendure/create installation, so it is safe to not invalidate the cache in this case.
        return (_a = this.cacheService) === null || _a === void 0 ? void 0 : _a.invalidateTags(this.tags);
    }
    /**
     * @description
     * The `CachedSession` interface includes a `Date` object, which we need to
     * manually serialize/deserialize to/from JSON.
     */
    serializeDates(session) {
        return Object.assign(Object.assign({}, session), { expires: session.expires.toISOString() });
    }
    deserializeDates(session) {
        return Object.assign(Object.assign({}, session), { expires: new Date(session.expires) });
    }
    getCacheKey(sessionToken) {
        var _a, _b;
        return `${(_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.cachePrefix) !== null && _b !== void 0 ? _b : 'vendure-session-cache'}:${sessionToken}`;
    }
}
exports.DefaultSessionCacheStrategy = DefaultSessionCacheStrategy;
//# sourceMappingURL=default-session-cache-strategy.js.map