"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DefaultCachePlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultCachePlugin = void 0;
const plugin_common_module_1 = require("../plugin-common.module");
const vendure_plugin_1 = require("../vendure-plugin");
const cache_item_entity_1 = require("./cache-item.entity");
const cache_tag_entity_1 = require("./cache-tag.entity");
const constants_1 = require("./constants");
const sql_cache_strategy_1 = require("./sql-cache-strategy");
/**
 * @description
 * This plugin provides a simple SQL-based cache strategy {@link SqlCacheStrategy} which stores cached
 * items in the database.
 *
 * It is suitable for production use (including multi-instance setups). For increased performance
 * you can also consider using the {@link RedisCachePlugin}.
 *
 * @docsCategory cache
 * @docsPage DefaultCachePlugin
 * @docsWeight 0
 * @since 3.1.0
 */
let DefaultCachePlugin = DefaultCachePlugin_1 = class DefaultCachePlugin {
    static init(options) {
        this.options = options;
        return DefaultCachePlugin_1;
    }
};
exports.DefaultCachePlugin = DefaultCachePlugin;
DefaultCachePlugin.options = {
    cacheSize: 10000,
};
exports.DefaultCachePlugin = DefaultCachePlugin = DefaultCachePlugin_1 = __decorate([
    (0, vendure_plugin_1.VendurePlugin)({
        imports: [plugin_common_module_1.PluginCommonModule],
        entities: [cache_item_entity_1.CacheItem, cache_tag_entity_1.CacheTag],
        providers: [{ provide: constants_1.PLUGIN_INIT_OPTIONS, useFactory: () => DefaultCachePlugin.options }],
        configuration: config => {
            config.systemOptions.cacheStrategy = new sql_cache_strategy_1.SqlCacheStrategy({
                cacheSize: DefaultCachePlugin.options.cacheSize,
                cacheTtlProvider: DefaultCachePlugin.options.cacheTtlProvider,
            });
            return config;
        },
        compatibility: '>0.0.0',
    })
], DefaultCachePlugin);
//# sourceMappingURL=default-cache-plugin.js.map