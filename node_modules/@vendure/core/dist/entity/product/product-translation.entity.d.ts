import { LanguageCode } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomProductFieldsTranslation } from '../custom-entity-fields';
import { Product } from './product.entity';
export declare class ProductTranslation extends VendureEntity implements Translation<Product>, HasCustomFields {
    constructor(input?: DeepPartial<Translation<Product>>);
    languageCode: LanguageCode;
    name: string;
    slug: string;
    description: string;
    base: Product;
    customFields: CustomProductFieldsTranslation;
}
