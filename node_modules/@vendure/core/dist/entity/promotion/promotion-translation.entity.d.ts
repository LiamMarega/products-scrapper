import { LanguageCode } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomPromotionFieldsTranslation } from '../custom-entity-fields';
import { Promotion } from './promotion.entity';
export declare class PromotionTranslation extends VendureEntity implements Translation<Promotion>, HasCustomFields {
    constructor(input?: DeepPartial<Translation<Promotion>>);
    languageCode: LanguageCode;
    name: string;
    description: string;
    base: Promotion;
    customFields: CustomPromotionFieldsTranslation;
}
