import { RedisCachePluginInitOptions } from './types';
/**
 * @description
 * This plugin provides a Redis-based {@link RedisCacheStrategy} which stores cached items in a Redis instance.
 * This is a high-performance cache strategy which is suitable for production use, and is a drop-in
 * replacement for the {@link DefaultCachePlugin}.
 *
 * Note: To use this plugin, you need to manually install the `ioredis` package:
 *
 * ```shell
 * npm install ioredis@^5.3.2
 * ```
 *
 * @docsCategory cache
 * @docsPage RedisCachePlugin
 * @docsWeight 0
 * @since 3.1.0
 */
export declare class RedisCachePlugin {
    static options: RedisCachePluginInitOptions;
    static init(options: RedisCachePluginInitOptions): typeof RedisCachePlugin;
}
