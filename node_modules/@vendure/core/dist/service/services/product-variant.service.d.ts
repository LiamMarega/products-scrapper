import { AssignProductVariantsToChannelInput, CreateProductVariantInput, CurrencyCode, DeletionResponse, RemoveProductVariantsFromChannelInput, UpdateProductVariantInput } from '@vendure/common/lib/generated-types';
import { CustomFieldsObject, ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/decorators/relations.decorator';
import { RequestContextCacheService } from '../../cache/request-context-cache.service';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Channel, Order, ProductVariantPrice } from '../../entity';
import { FacetValue } from '../../entity/facet-value/facet-value.entity';
import { ProductOption } from '../../entity/product-option/product-option.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { Product } from '../../entity/product/product.entity';
import { EventBus } from '../../event-bus/event-bus';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { ProductPriceApplicator } from '../helpers/product-price-applicator/product-price-applicator';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { TranslatorService } from '../helpers/translator/translator.service';
import { AssetService } from './asset.service';
import { ChannelService } from './channel.service';
import { FacetValueService } from './facet-value.service';
import { GlobalSettingsService } from './global-settings.service';
import { RoleService } from './role.service';
import { StockLevelService } from './stock-level.service';
import { StockMovementService } from './stock-movement.service';
import { TaxCategoryService } from './tax-category.service';
/**
 * @description
 * Contains methods relating to {@link ProductVariant} entities.
 *
 * @docsCategory services
 */
export declare class ProductVariantService {
    private connection;
    private configService;
    private taxCategoryService;
    private facetValueService;
    private assetService;
    private translatableSaver;
    private eventBus;
    private listQueryBuilder;
    private globalSettingsService;
    private stockMovementService;
    private stockLevelService;
    private channelService;
    private roleService;
    private customFieldRelationService;
    private requestCache;
    private productPriceApplicator;
    private translator;
    constructor(connection: TransactionalConnection, configService: ConfigService, taxCategoryService: TaxCategoryService, facetValueService: FacetValueService, assetService: AssetService, translatableSaver: TranslatableSaver, eventBus: EventBus, listQueryBuilder: ListQueryBuilder, globalSettingsService: GlobalSettingsService, stockMovementService: StockMovementService, stockLevelService: StockLevelService, channelService: ChannelService, roleService: RoleService, customFieldRelationService: CustomFieldRelationService, requestCache: RequestContextCacheService, productPriceApplicator: ProductPriceApplicator, translator: TranslatorService);
    findAll(ctx: RequestContext, options?: ListQueryOptions<ProductVariant>): Promise<PaginatedList<Translated<ProductVariant>>>;
    findOne(ctx: RequestContext, productVariantId: ID, relations?: RelationPaths<ProductVariant>): Promise<Translated<ProductVariant> | undefined>;
    findByIds(ctx: RequestContext, ids: ID[]): Promise<Array<Translated<ProductVariant>>>;
    getVariantsByProductId(ctx: RequestContext, productId: ID, options?: ListQueryOptions<ProductVariant>, relations?: RelationPaths<ProductVariant>): Promise<PaginatedList<Translated<ProductVariant>>>;
    /**
     * @description
     * Returns a {@link PaginatedList} of all ProductVariants associated with the given Collection.
     */
    getVariantsByCollectionId(ctx: RequestContext, collectionId: ID, options: ListQueryOptions<ProductVariant>, relations?: RelationPaths<ProductVariant>): Promise<PaginatedList<Translated<ProductVariant>>>;
    /**
     * @description
     * Returns all Channels to which the ProductVariant is assigned.
     */
    getProductVariantChannels(ctx: RequestContext, productVariantId: ID): Promise<Channel[]>;
    getProductVariantPrices(ctx: RequestContext, productVariantId: ID): Promise<ProductVariantPrice[]>;
    /**
     * @description
     * Returns the ProductVariant associated with the given {@link OrderLine}.
     */
    getVariantByOrderLineId(ctx: RequestContext, orderLineId: ID): Promise<Translated<ProductVariant>>;
    /**
     * @description
     * Returns the {@link ProductOption}s for the given ProductVariant.
     */
    getOptionsForVariant(ctx: RequestContext, variantId: ID): Promise<Array<Translated<ProductOption>>>;
    getFacetValuesForVariant(ctx: RequestContext, variantId: ID): Promise<Array<Translated<FacetValue>>>;
    /**
     * @description
     * Returns the Product associated with the ProductVariant. Whereas the `ProductService.findOne()`
     * method performs a large multi-table join with all the typical data needed for a "product detail"
     * page, this method returns only the Product itself.
     */
    getProductForVariant(ctx: RequestContext, variant: ProductVariant): Promise<Translated<Product>>;
    /**
     * @description
     * Returns the number of saleable units of the ProductVariant, i.e. how many are available
     * for purchase by Customers. This is determined by the ProductVariant's `stockOnHand` value,
     * as well as the local and global `outOfStockThreshold` settings.
     */
    getSaleableStockLevel(ctx: RequestContext, variant: ProductVariant): Promise<number>;
    private getOutOfStockThreshold;
    /**
     * @description
     * Returns the stockLevel to display to the customer, as specified by the configured
     * {@link StockDisplayStrategy}.
     */
    getDisplayStockLevel(ctx: RequestContext, variant: ProductVariant): Promise<string>;
    /**
     * @description
     * Returns the number of fulfillable units of the ProductVariant, equivalent to stockOnHand
     * for those variants which are tracking inventory.
     */
    getFulfillableStockLevel(ctx: RequestContext, variant: ProductVariant): Promise<number>;
    create(ctx: RequestContext, input: CreateProductVariantInput[]): Promise<Array<Translated<ProductVariant>>>;
    update(ctx: RequestContext, input: UpdateProductVariantInput[]): Promise<Array<Translated<ProductVariant>>>;
    private createSingle;
    private updateSingle;
    /**
     * @description
     * Creates a {@link ProductVariantPrice} for the given ProductVariant/Channel combination.
     * If the `currencyCode` is not specified, the default currency of the Channel will be used.
     */
    createOrUpdateProductVariantPrice(ctx: RequestContext, productVariantId: ID, price: number, channelId: ID, currencyCode?: CurrencyCode, customFields?: CustomFieldsObject): Promise<ProductVariantPrice>;
    deleteProductVariantPrice(ctx: RequestContext, variantId: ID, channelId: ID, currencyCode: CurrencyCode): Promise<void>;
    softDelete(ctx: RequestContext, id: ID | ID[]): Promise<DeletionResponse>;
    /**
     * @description
     * This method is intended to be used by the ProductVariant GraphQL entity resolver to resolve the
     * price-related fields which need to be populated at run-time using the `applyChannelPriceAndTax`
     * method.
     *
     * Is optimized to make as few DB calls as possible using caching based on the open request.
     */
    hydratePriceFields<F extends 'currencyCode' | 'price' | 'priceWithTax' | 'taxRateApplied'>(ctx: RequestContext, variant: ProductVariant, priceField: F): Promise<ProductVariant[F]>;
    /**
     * @description
     * Given an array of ProductVariants from the database, this method will apply the correct price and tax
     * and translate each item.
     */
    private applyPricesAndTranslateVariants;
    /**
     * @description
     * Populates the `price` field with the price for the specified channel.
     */
    applyChannelPriceAndTax(variant: ProductVariant, ctx: RequestContext, order?: Order, throwIfNoPriceFound?: boolean): Promise<ProductVariant>;
    /**
     * @description
     * Assigns the specified ProductVariants to the specified Channel. In doing so, it will create a new
     * {@link ProductVariantPrice} and also assign the associated Product and any Assets to the Channel too.
     */
    assignProductVariantsToChannel(ctx: RequestContext, input: AssignProductVariantsToChannelInput): Promise<Array<Translated<ProductVariant>>>;
    removeProductVariantsFromChannel(ctx: RequestContext, input: RemoveProductVariantsFromChannelInput): Promise<Array<Translated<ProductVariant>>>;
    private validateVariantOptionIds;
    private throwIncompatibleOptionsError;
    private sortJoin;
    private getTaxCategoryForNewVariant;
}
