import { CurrencyCode, ProductVariantPrice, StockMovementListOptions } from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';
import { RequestContextCacheService } from '../../../cache/request-context-cache.service';
import { Translated } from '../../../common/types/locale-types';
import { Asset, Channel, FacetValue, Product, ProductOption, StockLevel, TaxRate } from '../../../entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { StockMovement } from '../../../entity/stock-movement/stock-movement.entity';
import { LocaleStringHydrator } from '../../../service/helpers/locale-string-hydrator/locale-string-hydrator';
import { AssetService } from '../../../service/services/asset.service';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { StockLevelService } from '../../../service/services/stock-level.service';
import { StockMovementService } from '../../../service/services/stock-movement.service';
import { ApiType } from '../../common/get-api-type';
import { RequestContext } from '../../common/request-context';
export declare class ProductVariantEntityResolver {
    private productVariantService;
    private assetService;
    private localeStringHydrator;
    private requestContextCache;
    constructor(productVariantService: ProductVariantService, assetService: AssetService, localeStringHydrator: LocaleStringHydrator, requestContextCache: RequestContextCacheService);
    name(ctx: RequestContext, productVariant: ProductVariant): Promise<string>;
    languageCode(ctx: RequestContext, productVariant: ProductVariant): Promise<string>;
    price(ctx: RequestContext, productVariant: ProductVariant): Promise<number>;
    priceWithTax(ctx: RequestContext, productVariant: ProductVariant): Promise<number>;
    currencyCode(ctx: RequestContext, productVariant: ProductVariant): Promise<CurrencyCode>;
    taxRateApplied(ctx: RequestContext, productVariant: ProductVariant): Promise<TaxRate>;
    product(ctx: RequestContext, productVariant: ProductVariant): Promise<Product | undefined>;
    assets(ctx: RequestContext, productVariant: ProductVariant): Promise<Asset[] | undefined>;
    featuredAsset(ctx: RequestContext, productVariant: ProductVariant): Promise<Asset | undefined>;
    options(ctx: RequestContext, productVariant: ProductVariant): Promise<Array<Translated<ProductOption>>>;
    facetValues(ctx: RequestContext, productVariant: ProductVariant, apiType: ApiType): Promise<Array<Translated<FacetValue>>>;
    stockLevel(ctx: RequestContext, productVariant: ProductVariant): Promise<string>;
}
export declare class ProductVariantAdminEntityResolver {
    private productVariantService;
    private stockMovementService;
    private stockLevelService;
    constructor(productVariantService: ProductVariantService, stockMovementService: StockMovementService, stockLevelService: StockLevelService);
    stockMovements(ctx: RequestContext, productVariant: ProductVariant, args: {
        options: StockMovementListOptions;
    }): Promise<PaginatedList<StockMovement>>;
    stockOnHand(ctx: RequestContext, productVariant: ProductVariant): Promise<number>;
    stockAllocated(ctx: RequestContext, productVariant: ProductVariant, args: {
        options: StockMovementListOptions;
    }): Promise<number>;
    channels(ctx: RequestContext, productVariant: ProductVariant): Promise<Channel[]>;
    stockLevels(ctx: RequestContext, productVariant: ProductVariant): Promise<StockLevel[]>;
    prices(ctx: RequestContext, productVariant: ProductVariant): Promise<ProductVariantPrice[]>;
}
