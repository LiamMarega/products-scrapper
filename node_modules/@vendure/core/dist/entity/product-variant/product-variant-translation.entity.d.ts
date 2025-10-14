import { LanguageCode } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomProductVariantFieldsTranslation } from '../custom-entity-fields';
import { ProductVariant } from './product-variant.entity';
export declare class ProductVariantTranslation extends VendureEntity implements Translation<ProductVariant>, HasCustomFields {
    constructor(input?: DeepPartial<Translation<ProductVariant>>);
    languageCode: LanguageCode;
    name: string;
    base: ProductVariant;
    customFields: CustomProductVariantFieldsTranslation;
}
