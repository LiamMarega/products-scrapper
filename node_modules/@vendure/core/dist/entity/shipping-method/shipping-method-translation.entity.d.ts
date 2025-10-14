import { LanguageCode } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomShippingMethodFieldsTranslation } from '../custom-entity-fields';
import { Product } from '../product/product.entity';
import { ShippingMethod } from './shipping-method.entity';
export declare class ShippingMethodTranslation extends VendureEntity implements Translation<ShippingMethod>, HasCustomFields {
    constructor(input?: DeepPartial<Translation<Product>>);
    languageCode: LanguageCode;
    name: string;
    description: string;
    base: ShippingMethod;
    customFields: CustomShippingMethodFieldsTranslation;
}
