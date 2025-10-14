"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSelfRefreshingCache = createSelfRefreshingCache;
const vendure_logger_1 = require("../config/logger/vendure-logger");
/**
 * @description
 * Creates a {@link SelfRefreshingCache} object, which is used to cache a single frequently-accessed value. In this type
 * of cache, the function used to populate the value (`refreshFn`) is defined during the creation of the cache, and
 * it is immediately used to populate the initial value.
 *
 * From there, when the `.value` property is accessed, it will return a value from the cache, and if the
 * value has expired, it will automatically run the `refreshFn` to update the value and then return the
 * fresh value.
 *
 * @example
 * ```ts title="Example of creating a SelfRefreshingCache"
 * import { createSelfRefreshingCache } from '@vendure/core';
 *
 * \@Injectable()
 * export class PublicChannelService {
 *   private publicChannel: SelfRefreshingCache<Channel, [RequestContext]>;
 *
 *   async init() {
 *     this.publicChannel = await createSelfRefreshingCache<Channel, [RequestContext]>({
 *      name: 'PublicChannelService.publicChannel',
 *      ttl: 1000 * 60 * 60, // 1 hour
 *      refresh: {
 *        fn: async (ctx: RequestContext) => {
 *         return this.channelService.getPublicChannel(ctx);
 *       },
 *      defaultArgs: [RequestContext.empty()],
 *     },
 *   });
 * }
 * ```
 *
 * @docsCategory cache
 * @docsPage SelfRefreshingCache
 */
async function createSelfRefreshingCache(config, refreshArgs) {
    const { ttl, name, refresh, getTimeFn } = config;
    const getTimeNow = getTimeFn !== null && getTimeFn !== void 0 ? getTimeFn : (() => new Date().getTime());
    const initialValue = await refresh.fn(...(refreshArgs !== null && refreshArgs !== void 0 ? refreshArgs : refresh.defaultArgs));
    let value = initialValue;
    let expires = getTimeNow() + ttl;
    const memoCache = new Map();
    const refreshValue = (resetMemoCache = true, args) => {
        return refresh
            .fn(...args)
            .then(newValue => {
            value = newValue;
            expires = getTimeNow() + ttl;
            if (resetMemoCache) {
                memoCache.clear();
            }
            return value;
        })
            .catch((err) => {
            const _message = err.message;
            const message = typeof _message === 'string' ? _message : JSON.stringify(err.message);
            vendure_logger_1.Logger.error(`Failed to update SelfRefreshingCache "${name}": ${message}`, undefined, err.stack);
            return value;
        });
    };
    const getValue = async (_refreshArgs, resetMemoCache = true) => {
        const now = getTimeNow();
        if (expires < now) {
            return refreshValue(resetMemoCache, _refreshArgs !== null && _refreshArgs !== void 0 ? _refreshArgs : refresh.defaultArgs);
        }
        return value;
    };
    const memoize = async (args, _refreshArgs, fn) => {
        const key = JSON.stringify(args);
        const cached = memoCache.get(key);
        const now = getTimeNow();
        if (cached && now < cached.expires) {
            return cached.value;
        }
        const result = getValue(_refreshArgs, false).then(val => fn(val, ...args));
        memoCache.set(key, {
            expires: now + ttl,
            value: result,
        });
        return result;
    };
    return {
        value: (...args) => getValue(!args.length || (args.length === 1 && args[0] === undefined)
            ? undefined
            : args),
        refresh: (...args) => refreshValue(true, args),
        memoize,
    };
}
//# sourceMappingURL=self-refreshing-cache.js.map