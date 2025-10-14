import { CurrencyCode } from '@vendure/common/lib/generated-types';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomProductVariantPriceFields } from '../custom-entity-fields';
import { ProductVariant } from './product-variant.entity';
/**
 * @description
 * A ProductVariantPrice is a Channel-specific price for a ProductVariant. For every Channel to
 * which a ProductVariant is assigned, there will be a corresponding ProductVariantPrice entity.
 *
 * @docsCategory entities
 */
export declare class ProductVariantPrice extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<ProductVariantPrice>);
    price: number;
    channelId: ID;
    currencyCode: CurrencyCode;
    variant: ProductVariant;
    customFields: CustomProductVariantPriceFields;
}
