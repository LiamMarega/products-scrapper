import { DeepPartial } from '@vendure/common/lib/shared-types';
import { TaxRate } from '..';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomTaxCategoryFields } from '../custom-entity-fields';
import { ProductVariant } from '../product-variant/product-variant.entity';
/**
 * @description
 * A TaxCategory defines what type of taxes to apply to a {@link ProductVariant}.
 *
 * @docsCategory entities
 */
export declare class TaxCategory extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<TaxCategory>);
    name: string;
    isDefault: boolean;
    customFields: CustomTaxCategoryFields;
    productVariants: ProductVariant[];
    taxRates: TaxRate[];
}
