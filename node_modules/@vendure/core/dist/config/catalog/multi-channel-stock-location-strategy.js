"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiChannelStockLocationStrategy = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const ms_1 = __importDefault(require("ms"));
const operators_1 = require("rxjs/operators");
const index_1 = require("../../cache/index");
const index_2 = require("../../entity/index");
const stock_level_entity_1 = require("../../entity/stock-level/stock-level.entity");
const stock_location_entity_1 = require("../../entity/stock-location/stock-location.entity");
const index_3 = require("../../event-bus/index");
const default_stock_location_strategy_1 = require("./default-stock-location-strategy");
/**
 * @description
 * The MultiChannelStockLocationStrategy is an implementation of the {@link StockLocationStrategy}.
 * which is suitable for both single- and multichannel setups. It takes into account the active
 * channel when determining stock levels, and also ensures that allocations are made only against
 * stock locations which are associated with the active channel.
 *
 * This strategy became the default in Vendure 3.1.0. If you want to use the previous strategy which
 * does not take channels into account, update your VendureConfig to use to {@link DefaultStockLocationStrategy}.
 *
 * @docsCategory products & stock
 * @since 3.1.0
 */
class MultiChannelStockLocationStrategy extends default_stock_location_strategy_1.BaseStockLocationStrategy {
    /** @internal */
    async init(injector) {
        super.init(injector);
        this.eventBus = injector.get(index_3.EventBus);
        this.cacheService = injector.get(index_1.CacheService);
        this.requestContextCache = injector.get(index_1.RequestContextCacheService);
        // Dynamically import the GlobalSettingsService to avoid circular dependency
        const GlobalSettingsService = (await import('../../service/services/global-settings.service.js'))
            .GlobalSettingsService;
        this.globalSettingsService = injector.get(GlobalSettingsService);
        this.channelIdCache = this.cacheService.createCache({
            options: {
                ttl: (0, ms_1.default)('7 days'),
                tags: ['StockLocation'],
            },
            getKey: id => this.getCacheKey(id),
        });
        // When a StockLocation is updated, we need to invalidate the cache
        this.eventBus
            .ofType(index_3.StockLocationEvent)
            .pipe((0, operators_1.filter)(event => event.type !== 'created'))
            .subscribe(({ entity }) => this.channelIdCache.delete(this.getCacheKey(entity.id)));
    }
    /**
     * @description
     * Returns the available stock for the given ProductVariant, taking into account the active Channel.
     */
    async getAvailableStock(ctx, productVariantId, stockLevels) {
        let stockOnHand = 0;
        let stockAllocated = 0;
        for (const stockLevel of stockLevels) {
            const applies = await this.stockLevelAppliesToActiveChannel(ctx, stockLevel);
            if (applies) {
                stockOnHand += stockLevel.stockOnHand;
                stockAllocated += stockLevel.stockAllocated;
            }
        }
        return { stockOnHand, stockAllocated };
    }
    /**
     * @description
     * This method takes into account whether the stock location is applicable to the active channel.
     * It furthermore respects the `trackInventory` and `outOfStockThreshold` settings of the ProductVariant,
     * in order to allocate stock only from locations which are relevant to the active channel and which
     * have sufficient stock available.
     */
    async forAllocation(ctx, stockLocations, orderLine, quantity) {
        const stockLevels = await this.getStockLevelsForVariant(ctx, orderLine.productVariantId);
        const variant = await this.connection.getEntityOrThrow(ctx, index_2.ProductVariant, orderLine.productVariantId, { loadEagerRelations: false });
        let totalAllocated = 0;
        const locations = [];
        const { inventoryNotTracked, effectiveOutOfStockThreshold } = await this.getVariantStockSettings(ctx, variant);
        for (const stockLocation of stockLocations) {
            const stockLevel = stockLevels.find(sl => sl.stockLocationId === stockLocation.id);
            if (stockLevel && (await this.stockLevelAppliesToActiveChannel(ctx, stockLevel))) {
                const quantityAvailable = inventoryNotTracked
                    ? Number.MAX_SAFE_INTEGER
                    : stockLevel.stockOnHand - stockLevel.stockAllocated - effectiveOutOfStockThreshold;
                if (quantityAvailable > 0) {
                    const quantityToAllocate = Math.min(quantity, quantityAvailable);
                    locations.push({
                        location: stockLocation,
                        quantity: quantityToAllocate,
                    });
                    totalAllocated += quantityToAllocate;
                }
            }
            if (totalAllocated >= quantity) {
                break;
            }
        }
        return locations;
    }
    /**
     * @description
     * Determines whether the given StockLevel applies to the active Channel. Uses a cache to avoid
     * repeated DB queries.
     */
    async stockLevelAppliesToActiveChannel(ctx, stockLevel) {
        const channelIds = await this.channelIdCache.get(stockLevel.stockLocationId, async () => {
            const stockLocation = await this.connection.getEntityOrThrow(ctx, stock_location_entity_1.StockLocation, stockLevel.stockLocationId, {
                relations: {
                    channels: true,
                },
            });
            return stockLocation.channels.map(c => c.id);
        });
        return channelIds.includes(ctx.channelId);
    }
    getCacheKey(stockLocationId) {
        return `MultiChannelStockLocationStrategy:StockLocationChannelIds:${stockLocationId}`;
    }
    getStockLevelsForVariant(ctx, productVariantId) {
        return this.requestContextCache.get(ctx, `MultiChannelStockLocationStrategy.stockLevels.${productVariantId}`, () => this.connection.getRepository(ctx, stock_level_entity_1.StockLevel).find({
            where: {
                productVariantId,
            },
            loadEagerRelations: false,
        }));
    }
    async getVariantStockSettings(ctx, variant) {
        const { outOfStockThreshold, trackInventory } = await this.globalSettingsService.getSettings(ctx);
        const inventoryNotTracked = variant.trackInventory === generated_types_1.GlobalFlag.FALSE ||
            (variant.trackInventory === generated_types_1.GlobalFlag.INHERIT && trackInventory === false);
        const effectiveOutOfStockThreshold = variant.useGlobalOutOfStockThreshold
            ? outOfStockThreshold
            : variant.outOfStockThreshold;
        return {
            inventoryNotTracked,
            effectiveOutOfStockThreshold,
        };
    }
}
exports.MultiChannelStockLocationStrategy = MultiChannelStockLocationStrategy;
//# sourceMappingURL=multi-channel-stock-location-strategy.js.map