import { OrderLineInput, StockLevelInput, StockMovementListOptions } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { ShippingCalculator } from '../../config/shipping-method/shipping-calculator';
import { ShippingEligibilityChecker } from '../../config/shipping-method/shipping-eligibility-checker';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Order } from '../../entity/order/order.entity';
import { Allocation } from '../../entity/stock-movement/allocation.entity';
import { Cancellation } from '../../entity/stock-movement/cancellation.entity';
import { Release } from '../../entity/stock-movement/release.entity';
import { Sale } from '../../entity/stock-movement/sale.entity';
import { StockAdjustment } from '../../entity/stock-movement/stock-adjustment.entity';
import { StockMovement } from '../../entity/stock-movement/stock-movement.entity';
import { EventBus } from '../../event-bus/event-bus';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { GlobalSettingsService } from './global-settings.service';
import { StockLevelService } from './stock-level.service';
import { StockLocationService } from './stock-location.service';
/**
 * @description
 * Contains methods relating to {@link StockMovement} entities.
 *
 * @docsCategory services
 */
export declare class StockMovementService {
    private connection;
    private listQueryBuilder;
    private globalSettingsService;
    private stockLevelService;
    private eventBus;
    private stockLocationService;
    shippingEligibilityCheckers: ShippingEligibilityChecker[];
    shippingCalculators: ShippingCalculator[];
    private activeShippingMethods;
    constructor(connection: TransactionalConnection, listQueryBuilder: ListQueryBuilder, globalSettingsService: GlobalSettingsService, stockLevelService: StockLevelService, eventBus: EventBus, stockLocationService: StockLocationService);
    /**
     * @description
     * Returns a {@link PaginatedList} of all StockMovements associated with the specified ProductVariant.
     */
    getStockMovementsByProductVariantId(ctx: RequestContext, productVariantId: ID, options?: StockMovementListOptions): Promise<PaginatedList<StockMovement>>;
    /**
     * @description
     * Adjusts the stock level of the ProductVariant, creating a new {@link StockAdjustment} entity
     * in the process.
     */
    adjustProductVariantStock(ctx: RequestContext, productVariantId: ID, stockOnHandNumberOrInput: number | StockLevelInput[]): Promise<StockAdjustment[]>;
    /**
     * @description
     * Creates a new {@link Allocation} for each OrderLine in the Order. For ProductVariants
     * which are configured to track stock levels, the `ProductVariant.stockAllocated` value is
     * increased, indicating that this quantity of stock is allocated and cannot be sold.
     */
    createAllocationsForOrder(ctx: RequestContext, order: Order): Promise<Allocation[]>;
    /**
     * @description
     * Creates a new {@link Allocation} for each of the given OrderLines. For ProductVariants
     * which are configured to track stock levels, the `ProductVariant.stockAllocated` value is
     * increased, indicating that this quantity of stock is allocated and cannot be sold.
     */
    createAllocationsForOrderLines(ctx: RequestContext, lines: OrderLineInput[]): Promise<Allocation[]>;
    /**
     * @description
     * Creates {@link Sale}s for each OrderLine in the Order. For ProductVariants
     * which are configured to track stock levels, the `ProductVariant.stockAllocated` value is
     * reduced and the `stockOnHand` value is also reduced by the OrderLine quantity, indicating
     * that the stock is no longer allocated, but is actually sold and no longer available.
     */
    createSalesForOrder(ctx: RequestContext, lines: OrderLineInput[]): Promise<Sale[]>;
    /**
     * @description
     * Creates a {@link Cancellation} for each of the specified OrderItems. For ProductVariants
     * which are configured to track stock levels, the `ProductVariant.stockOnHand` value is
     * increased for each Cancellation, allowing that stock to be sold again.
     */
    createCancellationsForOrderLines(ctx: RequestContext, lineInputs: OrderLineInput[]): Promise<Cancellation[]>;
    /**
     * @description
     * Creates a {@link Release} for each of the specified OrderItems. For ProductVariants
     * which are configured to track stock levels, the `ProductVariant.stockAllocated` value is
     * reduced, indicating that this stock is once again available to buy.
     */
    createReleasesForOrderLines(ctx: RequestContext, lineInputs: OrderLineInput[]): Promise<Release[]>;
    private trackInventoryForVariant;
}
