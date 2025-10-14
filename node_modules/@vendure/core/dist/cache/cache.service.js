"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("../common");
const config_service_1 = require("../config/config.service");
const index_1 = require("../config/index");
const cache_1 = require("./cache");
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
let CacheService = class CacheService {
    constructor(configService) {
        this.configService = configService;
        this.cacheStrategy = this.configService.systemOptions.cacheStrategy;
    }
    /**
     * @description
     * Creates a new {@link Cache} instance with the given configuration.
     *
     * The `Cache` instance provides a convenience wrapper around the `CacheService`
     * methods.
     */
    createCache(config) {
        return new cache_1.Cache(config, this);
    }
    /**
     * @description
     * Gets an item from the cache, or returns undefined if the key is not found, or the
     * item has expired.
     */
    async get(key) {
        try {
            const result = await this.cacheStrategy.get(key);
            if (result) {
                index_1.Logger.debug(`CacheService hit for key [${key}]`);
            }
            return result;
        }
        catch (e) {
            index_1.Logger.error(`Could not get key [${key}] from CacheService`, undefined, e.stack);
        }
    }
    /**
     * @description
     * Sets a key-value pair in the cache. The value must be serializable, so cannot contain
     * things like functions, circular data structures, class instances etc.
     *
     * Optionally a "time to live" (ttl) can be specified, which means that the key will
     * be considered stale after that many milliseconds.
     */
    async set(key, value, options) {
        try {
            await this.cacheStrategy.set(key, value, options);
            index_1.Logger.debug(`Set key [${key}] in CacheService`);
        }
        catch (e) {
            index_1.Logger.error(`Could not set key [${key}] in CacheService`, undefined, e.stack);
        }
    }
    /**
     * @description
     * Deletes an item from the cache.
     */
    async delete(key) {
        try {
            await this.cacheStrategy.delete(key);
            index_1.Logger.debug(`Deleted key [${key}] from CacheService`);
        }
        catch (e) {
            index_1.Logger.error(`Could not delete key [${key}] from CacheService`, undefined, e.stack);
        }
    }
    /**
     * @description
     * Deletes all items from the cache which contain at least one matching tag.
     */
    async invalidateTags(tags) {
        try {
            await this.cacheStrategy.invalidateTags(tags);
            index_1.Logger.debug(`Invalidated tags [${tags.join(', ')}] from CacheService`);
        }
        catch (e) {
            index_1.Logger.error(`Could not invalidate tags [${tags.join(', ')}] from CacheService`, undefined, e.stack);
        }
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = __decorate([
    (0, common_1.Injectable)(),
    (0, common_2.Instrument)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], CacheService);
//# sourceMappingURL=cache.service.js.map