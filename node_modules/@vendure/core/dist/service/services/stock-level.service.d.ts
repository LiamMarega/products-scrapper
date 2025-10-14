import { ID } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { AvailableStock } from '../../config/catalog/stock-location-strategy';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { StockLevel } from '../../entity/stock-level/stock-level.entity';
import { StockLocationService } from './stock-location.service';
/**
 * @description
 * The StockLevelService is responsible for managing the stock levels of ProductVariants.
 * Whenever you need to adjust the `stockOnHand` or `stockAllocated` for a ProductVariant,
 * you should use this service.
 *
 * @docsCategory services
 * @since 2.0.0
 */
export declare class StockLevelService {
    private connection;
    private stockLocationService;
    private configService;
    constructor(connection: TransactionalConnection, stockLocationService: StockLocationService, configService: ConfigService);
    /**
     * @description
     * Returns the StockLevel for the given {@link ProductVariant} and {@link StockLocation}.
     */
    getStockLevel(ctx: RequestContext, productVariantId: ID, stockLocationId: ID): Promise<StockLevel>;
    getStockLevelsForVariant(ctx: RequestContext, productVariantId: ID): Promise<StockLevel[]>;
    /**
     * @description
     * Returns the available stock (on hand and allocated) for the given {@link ProductVariant}. This is determined
     * by the configured {@link StockLocationStrategy}.
     */
    getAvailableStock(ctx: RequestContext, productVariantId: ID): Promise<AvailableStock>;
    /**
     * @description
     * Updates the `stockOnHand` for the given {@link ProductVariant} and {@link StockLocation}.
     */
    updateStockOnHandForLocation(ctx: RequestContext, productVariantId: ID, stockLocationId: ID, change: number): Promise<void>;
    /**
     * @description
     * Updates the `stockAllocated` for the given {@link ProductVariant} and {@link StockLocation}.
     */
    updateStockAllocatedForLocation(ctx: RequestContext, productVariantId: ID, stockLocationId: ID, change: number): Promise<void>;
}
