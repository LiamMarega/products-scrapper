import { RequestContext } from '../../../api/common/request-context';
import { RequestContextCacheService } from '../../../cache/request-context-cache.service';
import { ConfigService } from '../../../config/config.service';
import { OrderLine } from '../../../entity';
import { Order } from '../../../entity/order/order.entity';
import { Promotion } from '../../../entity/promotion/promotion.entity';
import { ShippingMethodService } from '../../services/shipping-method.service';
import { TaxRateService } from '../../services/tax-rate.service';
import { ZoneService } from '../../services/zone.service';
import { ShippingCalculator } from '../shipping-calculator/shipping-calculator';
/**
 * @description
 * This helper is used when making changes to an Order, to apply all applicable price adjustments to that Order,
 * including:
 *
 * - Promotions
 * - Taxes
 * - Shipping
 *
 * @docsCategory service-helpers
 */
export declare class OrderCalculator {
    private configService;
    private zoneService;
    private taxRateService;
    private shippingMethodService;
    private shippingCalculator;
    private requestContextCache;
    constructor(configService: ConfigService, zoneService: ZoneService, taxRateService: TaxRateService, shippingMethodService: ShippingMethodService, shippingCalculator: ShippingCalculator, requestContextCache: RequestContextCacheService);
    /**
     * @description
     * Applies taxes and promotions to an Order. Mutates the order object.
     * Returns an array of any OrderItems which had new adjustments
     * applied, either tax or promotions.
     */
    applyPriceAdjustments(ctx: RequestContext, order: Order, promotions: Promotion[], updatedOrderLines?: OrderLine[], options?: {
        recalculateShipping?: boolean;
    }): Promise<Order>;
    /**
     * @description
     * Applies the correct TaxRate to each OrderLine in the order.
     */
    private applyTaxes;
    /**
     * @description
     * Applies the correct TaxRate to an OrderLine
     */
    private applyTaxesToOrderLine;
    /**
     * @description
     * Returns a memoized function for performing an efficient
     * lookup of the correct TaxRate for a given TaxCategory.
     */
    private createTaxRateGetter;
    /**
     * @description
     * Applies any eligible promotions to each OrderLine in the order.
     */
    private applyPromotions;
    /**
     * @description
     * Applies promotions to OrderItems. This is a quite complex function, due to the inherent complexity
     * of applying the promotions, and also due to added complexity in the name of performance
     * optimization. Therefore, it is heavily annotated so that the purpose of each step is clear.
     * Additionally, this is used in both promotionItemAction and promotionLineAction,
     * as it is difficult to separate action types at this stage.
     */
    private applyOrderItemPromotions;
    private applyOrderPromotions;
    private applyShippingPromotions;
    private applyShipping;
    /**
     * @description
     * Sets the totals properties on an Order by summing each OrderLine, and taking
     * into account any Surcharges and ShippingLines. Does not save the Order, so
     * the entity must be persisted to the DB after calling this method.
     *
     * Note that this method does *not* evaluate any taxes or promotions. It assumes
     * that has already been done and is solely responsible for summing the
     * totals.
     */
    calculateOrderTotals(order: Order): void;
    private addPromotion;
}
