import { LanguageCode } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomProductOptionFieldsTranslation } from '../custom-entity-fields';
import { ProductOption } from './product-option.entity';
export declare class ProductOptionTranslation extends VendureEntity implements Translation<ProductOption>, HasCustomFields {
    constructor(input?: DeepPartial<Translation<ProductOption>>);
    languageCode: LanguageCode;
    name: string;
    base: ProductOption;
    customFields: CustomProductOptionFieldsTranslation;
}
