"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RedisCachePlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCachePlugin = void 0;
const plugin_common_module_1 = require("../plugin-common.module");
const vendure_plugin_1 = require("../vendure-plugin");
const constants_1 = require("./constants");
const redis_cache_strategy_1 = require("./redis-cache-strategy");
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
let RedisCachePlugin = RedisCachePlugin_1 = class RedisCachePlugin {
    static init(options) {
        this.options = options;
        return RedisCachePlugin_1;
    }
};
exports.RedisCachePlugin = RedisCachePlugin;
RedisCachePlugin.options = {
    maxItemSizeInBytes: 128000,
    redisOptions: {},
    namespace: 'vendure-cache',
};
exports.RedisCachePlugin = RedisCachePlugin = RedisCachePlugin_1 = __decorate([
    (0, vendure_plugin_1.VendurePlugin)({
        imports: [plugin_common_module_1.PluginCommonModule],
        providers: [{ provide: constants_1.PLUGIN_INIT_OPTIONS, useFactory: () => RedisCachePlugin.options }],
        configuration: config => {
            config.systemOptions.cacheStrategy = new redis_cache_strategy_1.RedisCacheStrategy(RedisCachePlugin.options);
            return config;
        },
        compatibility: '>0.0.0',
    })
], RedisCachePlugin);
//# sourceMappingURL=redis-cache-plugin.js.map