import { HistoryEntryType } from '@vendure/common/lib/generated-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { Administrator } from '../administrator/administrator.entity';
import { VendureEntity } from '../base/base.entity';
import { CustomHistoryEntryFields } from '../custom-entity-fields';
/**
 * @description
 * An abstract entity representing an entry in the history of an Order ({@link OrderHistoryEntry})
 * or a Customer ({@link CustomerHistoryEntry}).
 *
 * @docsCategory entities
 */
export declare abstract class HistoryEntry extends VendureEntity implements HasCustomFields {
    administrator?: Administrator;
    readonly type: HistoryEntryType;
    isPublic: boolean;
    data: any;
    customFields: CustomHistoryEntryFields;
}
