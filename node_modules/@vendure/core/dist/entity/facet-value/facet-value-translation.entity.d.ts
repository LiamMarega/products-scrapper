import { LanguageCode } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Translation } from '../../common/types/locale-types';
import { VendureEntity } from '../base/base.entity';
import { CustomFacetValueFieldsTranslation } from '../custom-entity-fields';
import { FacetValue } from './facet-value.entity';
export declare class FacetValueTranslation extends VendureEntity implements Translation<FacetValue> {
    constructor(input?: DeepPartial<Translation<FacetValue>>);
    languageCode: LanguageCode;
    name: string;
    base: FacetValue;
    customFields: CustomFacetValueFieldsTranslation;
}
