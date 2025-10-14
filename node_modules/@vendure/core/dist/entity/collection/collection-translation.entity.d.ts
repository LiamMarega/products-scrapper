import { LanguageCode } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomCollectionFieldsTranslation } from '../custom-entity-fields';
import { Collection } from './collection.entity';
export declare class CollectionTranslation extends VendureEntity implements Translation<Collection>, HasCustomFields {
    constructor(input?: DeepPartial<Translation<Collection>>);
    languageCode: LanguageCode;
    name: string;
    slug: string;
    description: string;
    base: Collection;
    customFields: CustomCollectionFieldsTranslation;
}
