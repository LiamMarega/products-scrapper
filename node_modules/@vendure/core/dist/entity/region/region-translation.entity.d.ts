import { LanguageCode } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomRegionFieldsTranslation } from '../custom-entity-fields';
import { Region } from './region.entity';
export declare class RegionTranslation extends VendureEntity implements Translation<Region>, HasCustomFields {
    constructor(input?: DeepPartial<Translation<RegionTranslation>>);
    languageCode: LanguageCode;
    name: string;
    base: Region;
    customFields: CustomRegionFieldsTranslation;
}
