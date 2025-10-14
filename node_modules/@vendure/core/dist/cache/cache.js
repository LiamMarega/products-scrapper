"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
/**
 * @description
 * A convenience wrapper around the {@link CacheService} methods which provides a simple
 * API for caching and retrieving data.
 *
 * The advantage of using the `Cache` class rather than directly calling the `CacheService`
 * methods is that it allows you to define a consistent way of generating cache keys and
 * to set default cache options, and takes care of setting the value in cache if it does not
 * already exist.
 *
 * In most cases, using the `Cache` class will result in simpler and more readable code.
 *
 * This class is normally created via the {@link CacheService}.`createCache()` method.
 *
 * @example
 * ```ts
 * const cache = cacheService.createCache({
 *   getKey: id => `ProductVariantIds:${id}`,
 *   options: {
 *     ttl: 1000 * 60 * 60,
 *     tags: ['products'],
 *   },
 * });
 *
 * // This will fetch the value from the cache if it exists, or
 * // fetch it from the ProductService if not, and then cache
 * // using the key 'ProductVariantIds.${id}'.
 * const variantIds = await cache.get(id, async () => {
 *   const variants await ProductService.getVariantsByProductId(ctx, id) ;
 *   // The cached value must be serializable, so we just return the ids
 *   return variants.map(v => v.id);
 * });
 * ```
 *
 * @docsCategory cache
 * @since 3.1.0
 */
class Cache {
    constructor(config, cacheService) {
        this.config = config;
        this.cacheService = cacheService;
    }
    /**
     * @description
     * Retrieves the value from the cache if it exists, otherwise calls the `getValueFn` function
     * to get the value, sets it in the cache and returns it.
     */
    async get(id, getValueFn) {
        const key = this.config.getKey(id);
        const cachedValue = await this.cacheService.get(key);
        if (cachedValue) {
            return cachedValue;
        }
        const value = await getValueFn();
        await this.cacheService.set(key, value, this.config.options);
        return value;
    }
    /**
     * @description
     * Deletes one or more items from the cache.
     */
    async delete(id) {
        const ids = Array.isArray(id) ? id : [id];
        const keyArgs = ids.map(_id => this.config.getKey(_id));
        await Promise.all(keyArgs.map(key => this.cacheService.delete(key)));
    }
    /**
     * @description
     * Invalidates one or more tags in the cache.
     */
    async invalidateTags(tags) {
        await this.cacheService.invalidateTags(tags);
    }
}
exports.Cache = Cache;
//# sourceMappingURL=cache.js.map