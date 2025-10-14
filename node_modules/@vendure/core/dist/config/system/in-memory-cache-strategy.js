"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCacheStrategy = void 0;
const cache_ttl_provider_1 = require("../../cache/cache-ttl-provider");
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
class InMemoryCacheStrategy {
    constructor(config) {
        this.cache = new Map();
        this.cacheTags = new Map();
        this.cacheSize = 10000;
        if (config === null || config === void 0 ? void 0 : config.cacheSize) {
            this.cacheSize = config.cacheSize;
        }
        this.ttlProvider = (config === null || config === void 0 ? void 0 : config.cacheTtlProvider) || new cache_ttl_provider_1.DefaultCacheTtlProvider();
    }
    async get(key) {
        const hit = this.cache.get(key);
        if (hit) {
            if (!hit.expires || (hit.expires && this.ttlProvider.getTime() < hit.expires)) {
                return hit.value;
            }
            else {
                this.cache.delete(key);
            }
        }
    }
    async set(key, value, options) {
        if (this.cache.has(key)) {
            // delete key to put the item to the end of
            // the cache, marking it as new again
            this.cache.delete(key);
        }
        else if (this.cache.size === this.cacheSize) {
            // evict oldest
            const oldest = this.first();
            if (oldest) {
                this.cache.delete(oldest);
            }
        }
        this.cache.set(key, {
            value,
            expires: (options === null || options === void 0 ? void 0 : options.ttl) ? this.ttlProvider.getTime() + options.ttl : undefined,
        });
        if (options === null || options === void 0 ? void 0 : options.tags) {
            for (const tag of options.tags) {
                const tagged = this.cacheTags.get(tag) || new Set();
                tagged.add(key);
                this.cacheTags.set(tag, tagged);
            }
        }
    }
    async delete(key) {
        this.cache.delete(key);
    }
    async invalidateTags(tags) {
        for (const tag of tags) {
            const tagged = this.cacheTags.get(tag);
            if (tagged) {
                for (const key of tagged) {
                    this.cache.delete(key);
                }
                this.cacheTags.delete(tag);
            }
        }
    }
    first() {
        return this.cache.keys().next().value;
    }
}
exports.InMemoryCacheStrategy = InMemoryCacheStrategy;
//# sourceMappingURL=in-memory-cache-strategy.js.map