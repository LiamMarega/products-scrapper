"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheStrategy = void 0;
const vendure_logger_1 = require("../../config/logger/vendure-logger");
const constants_1 = require("./constants");
/**
 * @description
 * A {@link CacheStrategy} which stores cached items in a Redis instance.
 * This is a high-performance cache strategy which is suitable for production use.
 *
 * Note: To use this strategy, you need to manually install the `ioredis` package:
 *
 * ```shell
 * npm install ioredis@^5.3.2
 * ```
 *
 * @docsCategory cache
 * @since 3.1.0
 */
class RedisCacheStrategy {
    constructor(options) {
        this.options = options;
    }
    async init() {
        var _a;
        const IORedis = await import('ioredis').then(m => m.default);
        this.client = new IORedis.Redis((_a = this.options.redisOptions) !== null && _a !== void 0 ? _a : {});
        this.client.on('error', err => vendure_logger_1.Logger.error(err.message, constants_1.loggerCtx, err.stack));
    }
    async destroy() {
        await this.client.quit();
    }
    async get(key) {
        try {
            const retrieved = await this.client.get(this.namespace(key));
            if (retrieved) {
                try {
                    return JSON.parse(retrieved);
                }
                catch (e) {
                    vendure_logger_1.Logger.error(`Could not parse cache item ${key}: ${e.message}`, constants_1.loggerCtx);
                }
            }
        }
        catch (e) {
            vendure_logger_1.Logger.error(`Could not get cache item ${key}: ${e.message}`, constants_1.loggerCtx);
        }
    }
    async set(key, value, options) {
        try {
            const multi = this.client.multi();
            const ttl = (options === null || options === void 0 ? void 0 : options.ttl) ? options.ttl / 1000 : constants_1.DEFAULT_TTL;
            const namedspacedKey = this.namespace(key);
            const serializedValue = JSON.stringify(value);
            if (this.options.maxItemSizeInBytes) {
                if (Buffer.byteLength(serializedValue) > this.options.maxItemSizeInBytes) {
                    vendure_logger_1.Logger.error(`Could not set cache item ${key}: item size of ${Buffer.byteLength(serializedValue)} bytes exceeds maxItemSizeInBytes of ${this.options.maxItemSizeInBytes} bytes`, constants_1.loggerCtx);
                    return;
                }
            }
            if (Math.round(ttl) <= 0) {
                vendure_logger_1.Logger.error(`Could not set cache item ${key}: TTL must be greater than 0 seconds`, constants_1.loggerCtx);
                return;
            }
            multi.set(namedspacedKey, JSON.stringify(value), 'EX', Math.round(ttl));
            if (options === null || options === void 0 ? void 0 : options.tags) {
                for (const tag of options.tags) {
                    multi.sadd(this.tagNamespace(tag), namedspacedKey);
                }
            }
            const results = await multi.exec();
            const resultWithError = results === null || results === void 0 ? void 0 : results.find(([err, _]) => err);
            if (resultWithError) {
                throw resultWithError[0];
            }
        }
        catch (e) {
            vendure_logger_1.Logger.error(`Could not set cache item ${key}: ${e.message}`, constants_1.loggerCtx);
        }
    }
    async delete(key) {
        try {
            await this.client.del(this.namespace(key));
        }
        catch (e) {
            vendure_logger_1.Logger.error(`Could not delete cache item ${key}: ${e.message}`, constants_1.loggerCtx);
        }
    }
    async invalidateTags(tags) {
        try {
            const keys = [
                ...(await Promise.all(tags.map(tag => this.client.smembers(this.tagNamespace(tag))))),
            ];
            const pipeline = this.client.pipeline();
            keys.forEach(key => {
                pipeline.del(key);
            });
            tags.forEach(tag => {
                const namespacedTag = this.tagNamespace(tag);
                pipeline.del(namespacedTag);
            });
            await pipeline.exec();
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    namespace(key) {
        var _a;
        return `${(_a = this.options.namespace) !== null && _a !== void 0 ? _a : constants_1.DEFAULT_NAMESPACE}:${key}`;
    }
    tagNamespace(tag) {
        var _a;
        return `${(_a = this.options.namespace) !== null && _a !== void 0 ? _a : constants_1.DEFAULT_NAMESPACE}:tag:${tag}`;
    }
}
exports.RedisCacheStrategy = RedisCacheStrategy;
//# sourceMappingURL=redis-cache-strategy.js.map