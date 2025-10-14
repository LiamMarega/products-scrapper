import { AssignProductsToChannelInput, CreateProductInput, DeletionResponse, RemoveOptionGroupFromProductResult, RemoveProductsFromChannelInput, UpdateProductInput } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/decorators/relations.decorator';
import { ErrorResultUnion } from '../../common/error/error-result';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Channel } from '../../entity/channel/channel.entity';
import { FacetValue } from '../../entity/facet-value/facet-value.entity';
import { Product } from '../../entity/product/product.entity';
import { EventBus } from '../../event-bus/event-bus';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { SlugValidator } from '../helpers/slug-validator/slug-validator';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { TranslatorService } from '../helpers/translator/translator.service';
import { AssetService } from './asset.service';
import { ChannelService } from './channel.service';
import { FacetValueService } from './facet-value.service';
import { ProductOptionGroupService } from './product-option-group.service';
import { ProductVariantService } from './product-variant.service';
/**
 * @description
 * Contains methods relating to {@link Product} entities.
 *
 * @docsCategory services
 */
export declare class ProductService {
    private connection;
    private channelService;
    private assetService;
    private productVariantService;
    private facetValueService;
    private listQueryBuilder;
    private translatableSaver;
    private eventBus;
    private slugValidator;
    private customFieldRelationService;
    private translator;
    private productOptionGroupService;
    private readonly relations;
    constructor(connection: TransactionalConnection, channelService: ChannelService, assetService: AssetService, productVariantService: ProductVariantService, facetValueService: FacetValueService, listQueryBuilder: ListQueryBuilder, translatableSaver: TranslatableSaver, eventBus: EventBus, slugValidator: SlugValidator, customFieldRelationService: CustomFieldRelationService, translator: TranslatorService, productOptionGroupService: ProductOptionGroupService);
    findAll(ctx: RequestContext, options?: ListQueryOptions<Product>, relations?: RelationPaths<Product>): Promise<PaginatedList<Translated<Product>>>;
    findOne(ctx: RequestContext, productId: ID, relations?: RelationPaths<Product>): Promise<Translated<Product> | undefined>;
    findByIds(ctx: RequestContext, productIds: ID[], relations?: RelationPaths<Product>): Promise<Array<Translated<Product>>>;
    /**
     * @description
     * Returns all Channels to which the Product is assigned.
     */
    getProductChannels(ctx: RequestContext, productId: ID): Promise<Channel[]>;
    getFacetValuesForProduct(ctx: RequestContext, productId: ID): Promise<Array<Translated<FacetValue>>>;
    findOneBySlug(ctx: RequestContext, slug: string, relations?: RelationPaths<Product>): Promise<Translated<Product> | undefined>;
    create(ctx: RequestContext, input: CreateProductInput): Promise<Translated<Product>>;
    update(ctx: RequestContext, input: UpdateProductInput): Promise<Translated<Product>>;
    softDelete(ctx: RequestContext, productId: ID): Promise<DeletionResponse>;
    /**
     * @description
     * Assigns a Product to the specified Channel, and optionally uses a `priceFactor` to set the ProductVariantPrices
     * on the new Channel.
     *
     * Internally, this method will also call {@link ProductVariantService} `assignProductVariantsToChannel()` for
     * each of the Product's variants, and will assign the Product's Assets to the Channel too.
     */
    assignProductsToChannel(ctx: RequestContext, input: AssignProductsToChannelInput): Promise<Array<Translated<Product>>>;
    removeProductsFromChannel(ctx: RequestContext, input: RemoveProductsFromChannelInput): Promise<Array<Translated<Product>>>;
    addOptionGroupToProduct(ctx: RequestContext, productId: ID, optionGroupId: ID): Promise<Translated<Product>>;
    removeOptionGroupFromProduct(ctx: RequestContext, productId: ID, optionGroupId: ID, force?: boolean): Promise<ErrorResultUnion<RemoveOptionGroupFromProductResult, Translated<Product>>>;
    private getProductWithOptionGroups;
}
