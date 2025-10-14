import { CurrencyCode, LanguageCode } from '@vendure/common/lib/generated-types';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Customer, PaymentMethod, Promotion, Role, ShippingMethod, StockLocation } from '..';
import { VendureEntity } from '../base/base.entity';
import { Collection } from '../collection/collection.entity';
import { CustomChannelFields } from '../custom-entity-fields';
import { Facet } from '../facet/facet.entity';
import { FacetValue } from '../facet-value/facet-value.entity';
import { Product } from '../product/product.entity';
import { ProductVariant } from '../product-variant/product-variant.entity';
import { Seller } from '../seller/seller.entity';
import { Zone } from '../zone/zone.entity';
/**
 * @description
 * A Channel represents a distinct sales channel and configures defaults for that
 * channel.
 *
 * * Set a channel-specific currency, language, tax and shipping defaults
 * * Assign only specific Products to the Channel (with Channel-specific prices)
 * * Create Administrator roles limited to the Channel
 * * Assign only specific StockLocations, Assets, Facets, Collections, Promotions, ShippingMethods & PaymentMethods to the Channel
 * * Have Orders and Customers associated with specific Channels.
 *
 * In Vendure, Channels have a number of different uses, such as:
 *
 * * Multi-region stores, where there is a distinct website for each territory with its own available inventory, pricing, tax and shipping rules.
 * * Creating distinct rules and inventory for different sales channels such as Amazon.
 * * Specialized stores offering a subset of the main inventory.
 * * Implementing multi-vendor marketplace applications.
 *
 * @docsCategory entities
 */
export declare class Channel extends VendureEntity {
    constructor(input?: DeepPartial<Channel>);
    /**
     * @description
     * The name of the Channel. For example "US Webstore" or "German Webstore".
     */
    code: string;
    /**
     * @description
     * A unique token (string) used to identify the Channel in the `vendure-token` header of the
     * GraphQL API requests.
     */
    token: string;
    description: string;
    seller?: Seller;
    sellerId?: ID;
    defaultLanguageCode: LanguageCode;
    availableLanguageCodes: LanguageCode[];
    defaultTaxZone: Zone;
    defaultShippingZone: Zone;
    defaultCurrencyCode: CurrencyCode;
    availableCurrencyCodes: CurrencyCode[];
    /**
     * @description
     * Specifies the default value for inventory tracking for ProductVariants.
     * Can be overridden per ProductVariant, but this value determines the default
     * if not otherwise specified.
     */
    trackInventory: boolean;
    /**
     * @description
     * Specifies the value of stockOnHand at which a given ProductVariant is considered
     * out of stock.
     */
    outOfStockThreshold: number;
    customFields: CustomChannelFields;
    pricesIncludeTax: boolean;
    products: Product[];
    productVariants: ProductVariant[];
    facetValues: FacetValue[];
    facets: Facet[];
    collections: Collection[];
    promotions: Promotion[];
    paymentMethods: PaymentMethod[];
    shippingMethods: ShippingMethod[];
    customers: Customer[];
    roles: Role[];
    stockLocations: StockLocation[];
    private generateToken;
}
