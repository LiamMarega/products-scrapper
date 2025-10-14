import { QueryCollectionArgs, QueryCollectionsArgs, QueryFacetArgs, QueryFacetsArgs, QueryProductArgs, QueryProductsArgs, SearchResponse } from '@vendure/common/lib/generated-shop-types';
import { Omit } from '@vendure/common/lib/omit';
import { PaginatedList } from '@vendure/common/lib/shared-types';
import { Translated } from '../../../common/types/locale-types';
import { Collection } from '../../../entity/collection/collection.entity';
import { Facet } from '../../../entity/facet/facet.entity';
import { Product } from '../../../entity/product/product.entity';
import { CollectionService, FacetService } from '../../../service';
import { FacetValueService } from '../../../service/services/facet-value.service';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { ProductService } from '../../../service/services/product.service';
import { RequestContext } from '../../common/request-context';
import { RelationPaths } from '../../decorators/relations.decorator';
export declare class ShopProductsResolver {
    private productService;
    private productVariantService;
    private facetValueService;
    private collectionService;
    private facetService;
    constructor(productService: ProductService, productVariantService: ProductVariantService, facetValueService: FacetValueService, collectionService: CollectionService, facetService: FacetService);
    products(ctx: RequestContext, args: QueryProductsArgs, relations: RelationPaths<Product>): Promise<PaginatedList<Translated<Product>>>;
    product(ctx: RequestContext, args: QueryProductArgs, relations: RelationPaths<Product>): Promise<Translated<Product> | undefined>;
    collections(ctx: RequestContext, args: QueryCollectionsArgs, relations: RelationPaths<Collection>): Promise<PaginatedList<Translated<Collection>>>;
    collection(ctx: RequestContext, args: QueryCollectionArgs, relations: RelationPaths<Collection>): Promise<Translated<Collection> | undefined>;
    search(...args: any): Promise<Omit<SearchResponse, 'facetValues'>>;
    facets(ctx: RequestContext, args: QueryFacetsArgs, relations: RelationPaths<Facet>): Promise<PaginatedList<Translated<Facet>>>;
    facet(ctx: RequestContext, args: QueryFacetArgs, relations: RelationPaths<Facet>): Promise<Translated<Facet> | undefined>;
}
