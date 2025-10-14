import { Type } from '@vendure/common/lib/shared-types';
import { OrderByCondition } from 'typeorm';
import { DataSource } from 'typeorm/data-source/DataSource';
import { NullOptionals, SortParameter } from '../../../common/types/common-types';
import { CustomFieldConfig } from '../../../config/custom-field/custom-field-types';
import { VendureEntity } from '../../../entity/base/base.entity';
/**
 * Parses the provided SortParameter array against the metadata of the given entity, ensuring that only
 * valid fields are being sorted against. The output assumes
 * @param connection
 * @param entity
 * @param sortParams
 * @param customPropertyMap
 * @param entityAlias
 * @param customFields
 */
export declare function parseSortParams<T extends VendureEntity>(connection: DataSource, entity: Type<T>, sortParams?: NullOptionals<SortParameter<T>> | null, customPropertyMap?: {
    [name: string]: string;
}, entityAlias?: string, customFields?: CustomFieldConfig[]): OrderByCondition;
