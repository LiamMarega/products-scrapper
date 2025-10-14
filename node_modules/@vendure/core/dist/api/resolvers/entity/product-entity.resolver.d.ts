import { ProductVariantListOptions } from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';
import { Translated } from '../../../common/types/locale-types';
import { Asset } from '../../../entity/asset/asset.entity';
import { Channel } from '../../../entity/channel/channel.entity';
import { Collection } from '../../../entity/collection/collection.entity';
import { FacetValue } from '../../../entity/facet-value/facet-value.entity';
import { Product } from '../../../entity/product/product.entity';
import { ProductOptionGroup } from '../../../entity/product-option-group/product-option-group.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { LocaleStringHydrator } from '../../../service/helpers/locale-string-hydrator/locale-string-hydrator';
import { AssetService } from '../../../service/services/asset.service';
import { CollectionService } from '../../../service/services/collection.service';
import { FacetValueService } from '../../../service/services/facet-value.service';
import { ProductOptionGroupService } from '../../../service/services/product-option-group.service';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { ProductService } from '../../../service/services/product.service';
import { ApiType } from '../../common/get-api-type';
import { RequestContext } from '../../common/request-context';
import { RelationPaths } from '../../decorators/relations.decorator';
export declare class ProductEntityResolver {
    private productVariantService;
    private collectionService;
    private productOptionGroupService;
    private assetService;
    private productService;
    private facetValueService;
    private localeStringHydrator;
    constructor(productVariantService: ProductVariantService, collectionService: CollectionService, productOptionGroupService: ProductOptionGroupService, assetService: AssetService, productService: ProductService, facetValueService: FacetValueService, localeStringHydrator: LocaleStringHydrator);
    name(ctx: RequestContext, product: Product): Promise<string>;
    slug(ctx: RequestContext, product: Product): Promise<string>;
    description(ctx: RequestContext, product: Product): Promise<string>;
    languageCode(ctx: RequestContext, product: Product): Promise<string>;
    variants(ctx: RequestContext, product: Product, relations: RelationPaths<ProductVariant>): Promise<Array<Translated<ProductVariant>>>;
    variantList(ctx: RequestContext, product: Product, args: {
        options: ProductVariantListOptions;
    }, relations: RelationPaths<ProductVariant>): Promise<PaginatedList<ProductVariant>>;
    collections(ctx: RequestContext, product: Product, apiType: ApiType): Promise<Array<Translated<Collection>>>;
    optionGroups(info: any, ctx: RequestContext, product: Product): Promise<Array<Translated<ProductOptionGroup>>>;
    facetValues(ctx: RequestContext, product: Product, apiType: ApiType): Promise<Array<Translated<FacetValue>>>;
    featuredAsset(ctx: RequestContext, product: Product): Promise<Asset | undefined>;
    assets(ctx: RequestContext, product: Product): Promise<Asset[] | undefined>;
}
export declare class ProductAdminEntityResolver {
    private productService;
    constructor(productService: ProductService);
    channels(ctx: RequestContext, product: Product): Promise<Channel[]>;
}
