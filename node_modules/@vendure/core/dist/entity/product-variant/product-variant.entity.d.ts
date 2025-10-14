import { CurrencyCode, GlobalFlag } from '@vendure/common/lib/generated-types';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { ChannelAware, SoftDeletable } from '../../common/types/common-types';
import { LocaleString, Translatable, Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { Asset } from '../asset/asset.entity';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { Collection } from '../collection/collection.entity';
import { CustomProductVariantFields } from '../custom-entity-fields';
import { FacetValue } from '../facet-value/facet-value.entity';
import { OrderLine } from '../order-line/order-line.entity';
import { Product } from '../product/product.entity';
import { ProductOption } from '../product-option/product-option.entity';
import { StockLevel } from '../stock-level/stock-level.entity';
import { StockMovement } from '../stock-movement/stock-movement.entity';
import { TaxCategory } from '../tax-category/tax-category.entity';
import { TaxRate } from '../tax-rate/tax-rate.entity';
import { ProductVariantAsset } from './product-variant-asset.entity';
import { ProductVariantPrice } from './product-variant-price.entity';
/**
 * @description
 * A ProductVariant represents a single stock keeping unit (SKU) in the store's inventory.
 * Whereas a {@link Product} is a "container" of variants, the variant itself holds the
 * data on price, tax category etc. When one adds items to their cart, they are adding
 * ProductVariants, not Products.
 *
 * @docsCategory entities
 */
export declare class ProductVariant extends VendureEntity implements Translatable, HasCustomFields, SoftDeletable, ChannelAware {
    constructor(input?: DeepPartial<ProductVariant>);
    deletedAt: Date | null;
    name: LocaleString;
    enabled: boolean;
    sku: string;
    /**
     * Calculated at run-time
     */
    listPrice: number;
    /**
     * Calculated at run-time
     */
    listPriceIncludesTax: boolean;
    /**
     * Calculated at run-time
     */
    currencyCode: CurrencyCode;
    get price(): number;
    get priceWithTax(): number;
    /**
     * Calculated at run-time
     */
    taxRateApplied: TaxRate;
    featuredAsset: Asset;
    featuredAssetId: ID;
    assets: ProductVariantAsset[];
    taxCategory: TaxCategory;
    taxCategoryId: ID;
    productVariantPrices: ProductVariantPrice[];
    translations: Array<Translation<ProductVariant>>;
    product: Product;
    productId: ID;
    /**
     * @description
     * Specifies the value of stockOnHand at which the ProductVariant is considered
     * out of stock.
     */
    outOfStockThreshold: number;
    /**
     * @description
     * When true, the `outOfStockThreshold` value will be taken from the GlobalSettings and the
     * value set on this ProductVariant will be ignored.
     */
    useGlobalOutOfStockThreshold: boolean;
    trackInventory: GlobalFlag;
    stockLevels: StockLevel[];
    stockMovements: StockMovement[];
    options: ProductOption[];
    facetValues: FacetValue[];
    customFields: CustomProductVariantFields;
    collections: Collection[];
    channels: Channel[];
    lines: OrderLine[];
}
