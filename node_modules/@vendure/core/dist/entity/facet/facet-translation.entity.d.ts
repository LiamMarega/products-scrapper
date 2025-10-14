import { LanguageCode } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomFacetFieldsTranslation } from '../custom-entity-fields';
import { Facet } from './facet.entity';
export declare class FacetTranslation extends VendureEntity implements Translation<Facet>, HasCustomFields {
    constructor(input?: DeepPartial<Translation<FacetTranslation>>);
    languageCode: LanguageCode;
    name: string;
    base: Facet;
    customFields: CustomFacetFieldsTranslation;
}
