import { RequestContext } from '../../../api/common/request-context';
import { RequestContextCacheService } from '../../../cache/request-context-cache.service';
import { ConfigService } from '../../../config/config.service';
import { Order } from '../../../entity/order/order.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { TaxRateService } from '../../services/tax-rate.service';
import { ZoneService } from '../../services/zone.service';
/**
 * @description
 * This helper is used to apply the correct price to a ProductVariant based on the current context
 * including active Channel, any current Order, etc. If you use the {@link TransactionalConnection} to
 * directly query ProductVariants, you will find that the `price` and `priceWithTax` properties will
 * always be `0` until you use the `applyChannelPriceAndTax()` method:
 *
 * @example
 * ```ts
 * export class MyCustomService {
 *   constructor(private connection: TransactionalConnection,
 *               private productPriceApplicator: ProductPriceApplicator) {}
 *
 *   getVariant(ctx: RequestContext, id: ID) {
 *     const productVariant = await this.connection
 *       .getRepository(ctx, ProductVariant)
 *       .findOne(id, { relations: ['taxCategory'] });
 *
 *     await this.productPriceApplicator
 *       .applyChannelPriceAndTax(productVariant, ctx);
 *
 *     return productVariant;
 *   }
 * }
 * ```
 *
 * @docsCategory service-helpers
 */
export declare class ProductPriceApplicator {
    private configService;
    private taxRateService;
    private zoneService;
    private requestCache;
    constructor(configService: ConfigService, taxRateService: TaxRateService, zoneService: ZoneService, requestCache: RequestContextCacheService);
    /**
     * @description
     * Populates the `price` field with the price for the specified channel. Make sure that
     * the ProductVariant being passed in has its `taxCategory` relation joined.
     *
     * If the `throwIfNoPriceFound` option is set to `true`, then an error will be thrown if no
     * price is found for the given Channel.
     */
    applyChannelPriceAndTax(variant: ProductVariant, ctx: RequestContext, order?: Order, throwIfNoPriceFound?: boolean): Promise<ProductVariant>;
}
