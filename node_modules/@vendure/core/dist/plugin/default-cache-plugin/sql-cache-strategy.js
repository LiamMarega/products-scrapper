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
exports.SqlCacheStrategy = void 0;
const cache_ttl_provider_1 = require("../../cache/cache-ttl-provider");
const instrument_decorator_1 = require("../../common/instrument-decorator");
const index_1 = require("../../config/index");
const index_2 = require("../../connection/index");
const cache_item_entity_1 = require("./cache-item.entity");
const cache_tag_entity_1 = require("./cache-tag.entity");
/**
 * @description
 * A {@link CacheStrategy} that stores cached items in the database. This
 * is the strategy used by the {@link DefaultCachePlugin}.
 *
 * @since 3.1.0
 * @docsCategory cache
 */
let SqlCacheStrategy = class SqlCacheStrategy {
    constructor(config) {
        this.cacheSize = 10000;
        if (config === null || config === void 0 ? void 0 : config.cacheSize) {
            this.cacheSize = config.cacheSize;
        }
        this.ttlProvider = (config === null || config === void 0 ? void 0 : config.cacheTtlProvider) || new cache_ttl_provider_1.DefaultCacheTtlProvider();
    }
    init(injector) {
        this.connection = injector.get(index_2.TransactionalConnection);
        this.configService = injector.get(index_1.ConfigService);
    }
    async get(key) {
        const hit = await this.connection.rawConnection.getRepository(cache_item_entity_1.CacheItem).findOne({
            where: {
                key,
            },
        });
        if (hit) {
            if (!hit.expiresAt || (hit.expiresAt && this.ttlProvider.getTime() < hit.expiresAt.getTime())) {
                try {
                    return JSON.parse(hit.value);
                }
                catch (e) {
                    /* */
                }
            }
            else {
                await this.connection.rawConnection.getRepository(cache_item_entity_1.CacheItem).delete({
                    key,
                });
            }
        }
    }
    async set(key, value, options) {
        const cacheSize = await this.connection.rawConnection.getRepository(cache_item_entity_1.CacheItem).count();
        if (cacheSize >= this.cacheSize) {
            // evict oldest
            const subQuery1 = this.connection.rawConnection
                .getRepository(cache_item_entity_1.CacheItem)
                .createQueryBuilder('item')
                .select('item.id', 'item_id')
                .orderBy('item.insertedAt', 'DESC')
                .limit(1000)
                .offset(Math.max(this.cacheSize - 1, 1));
            const subQuery2 = this.connection.rawConnection
                .createQueryBuilder()
                .select('t.item_id')
                .from(`(${subQuery1.getQuery()})`, 't');
            const qb = this.connection.rawConnection
                .getRepository(cache_item_entity_1.CacheItem)
                .createQueryBuilder('cache_item')
                .delete()
                .from(cache_item_entity_1.CacheItem, 'cache_item')
                .where(`cache_item.id IN (${subQuery2.getQuery()})`);
            try {
                await qb.execute();
            }
            catch (e) {
                index_1.Logger.error(`An error occurred when attempting to prune the cache: ${e.message}`);
            }
        }
        const item = await this.connection.rawConnection.getRepository(cache_item_entity_1.CacheItem).upsert(new cache_item_entity_1.CacheItem({
            key,
            insertedAt: new Date(),
            value: JSON.stringify(value),
            expiresAt: (options === null || options === void 0 ? void 0 : options.ttl) ? new Date(this.ttlProvider.getTime() + options.ttl) : undefined,
        }), ['key']);
        if (options === null || options === void 0 ? void 0 : options.tags) {
            for (const tag of options.tags) {
                try {
                    await this.connection.rawConnection.getRepository(cache_tag_entity_1.CacheTag).upsert({
                        tag,
                        item: item.identifiers[0],
                    }, ['tag', 'itemId']);
                }
                catch (e) {
                    index_1.Logger.error(`Error inserting tag`, e.message);
                }
            }
        }
    }
    async delete(key) {
        await this.connection.rawConnection.getRepository(cache_item_entity_1.CacheItem).delete({
            key,
        });
    }
    async invalidateTags(tags) {
        await this.connection.withTransaction(async (ctx) => {
            const itemIds = await this.connection
                .getRepository(ctx, cache_tag_entity_1.CacheTag)
                .createQueryBuilder('cache_tag')
                .select('cache_tag.itemId')
                .where('cache_tag.tag IN (:...tags)', { tags })
                .groupBy('cache_tag.itemId')
                .groupBy('cache_tag.id')
                .getMany();
            await this.connection
                .getRepository(ctx, cache_tag_entity_1.CacheTag)
                .createQueryBuilder('cache_tag')
                .delete()
                .where('cache_tag.tag IN (:...tags)', { tags })
                .execute();
            if (itemIds.length) {
                const ids = itemIds.map(i => i.itemId);
                const batchSize = 1000;
                for (let i = 0; i < itemIds.length; i += batchSize) {
                    const batch = ids.slice(i, batchSize);
                    try {
                        await this.connection.getRepository(ctx, cache_item_entity_1.CacheItem).delete(batch);
                    }
                    catch (e) {
                        index_1.Logger.error(`Error deleting items`, e.message);
                    }
                }
            }
        });
    }
};
exports.SqlCacheStrategy = SqlCacheStrategy;
exports.SqlCacheStrategy = SqlCacheStrategy = __decorate([
    (0, instrument_decorator_1.Instrument)(),
    __metadata("design:paramtypes", [Object])
], SqlCacheStrategy);
//# sourceMappingURL=sql-cache-strategy.js.map