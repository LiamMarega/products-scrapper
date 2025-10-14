import { JsonCompatible } from '@vendure/common/lib/shared-types';
import { CacheStrategy, SetCacheKeyOptions } from '../../config/system/cache-strategy';
import { RedisCachePluginInitOptions } from './types';
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
export declare class RedisCacheStrategy implements CacheStrategy {
    private options;
    private client;
    constructor(options: RedisCachePluginInitOptions);
    init(): Promise<void>;
    destroy(): Promise<void>;
    get<T extends JsonCompatible<T>>(key: string): Promise<T | undefined>;
    set<T extends JsonCompatible<T>>(key: string, value: T, options?: SetCacheKeyOptions): Promise<void>;
    delete(key: string): Promise<void>;
    invalidateTags(tags: string[]): Promise<void>;
    private namespace;
    private tagNamespace;
}
