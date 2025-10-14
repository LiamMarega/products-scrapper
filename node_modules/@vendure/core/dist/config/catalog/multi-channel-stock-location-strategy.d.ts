import type { GlobalSettingsService } from '../../service/index';
import { ID } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { Cache, CacheService, RequestContextCacheService } from '../../cache/index';
import { Injector } from '../../common/injector';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { StockLevel } from '../../entity/stock-level/stock-level.entity';
import { StockLocation } from '../../entity/stock-location/stock-location.entity';
import { EventBus } from '../../event-bus/index';
import { BaseStockLocationStrategy } from './default-stock-location-strategy';
import { AvailableStock, LocationWithQuantity } from './stock-location-strategy';
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
export declare class MultiChannelStockLocationStrategy extends BaseStockLocationStrategy {
    /** @internal */
    protected cacheService: CacheService;
    /** @internal */
    protected channelIdCache: Cache;
    /** @internal */
    protected eventBus: EventBus;
    /** @internal */
    protected globalSettingsService: GlobalSettingsService;
    /** @internal */
    protected requestContextCache: RequestContextCacheService;
    /** @internal */
    init(injector: Injector): Promise<void>;
    /**
     * @description
     * Returns the available stock for the given ProductVariant, taking into account the active Channel.
     */
    getAvailableStock(ctx: RequestContext, productVariantId: ID, stockLevels: StockLevel[]): Promise<AvailableStock>;
    /**
     * @description
     * This method takes into account whether the stock location is applicable to the active channel.
     * It furthermore respects the `trackInventory` and `outOfStockThreshold` settings of the ProductVariant,
     * in order to allocate stock only from locations which are relevant to the active channel and which
     * have sufficient stock available.
     */
    forAllocation(ctx: RequestContext, stockLocations: StockLocation[], orderLine: OrderLine, quantity: number): Promise<LocationWithQuantity[]>;
    /**
     * @description
     * Determines whether the given StockLevel applies to the active Channel. Uses a cache to avoid
     * repeated DB queries.
     */
    private stockLevelAppliesToActiveChannel;
    private getCacheKey;
    private getStockLevelsForVariant;
    private getVariantStockSettings;
}
