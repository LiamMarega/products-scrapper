import { LanguageCode } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomPaymentMethodFieldsTranslation } from '../custom-entity-fields';
import { PaymentMethod } from './payment-method.entity';
export declare class PaymentMethodTranslation extends VendureEntity implements Translation<PaymentMethod>, HasCustomFields {
    constructor(input?: DeepPartial<Translation<PaymentMethod>>);
    languageCode: LanguageCode;
    name: string;
    description: string;
    base: PaymentMethod;
    customFields: CustomPaymentMethodFieldsTranslation;
}
