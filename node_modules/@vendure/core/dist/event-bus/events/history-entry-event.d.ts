import { HistoryEntryType } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { HistoryEntry } from '../../entity/history-entry/history-entry.entity';
import { VendureEntityEvent } from '../vendure-entity-event';
type HistoryInput = {
    type: HistoryEntryType;
    data?: any;
} | ID;
/**
 * @description
 * This event is fired whenever one {@link HistoryEntry} is added, updated or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export declare class HistoryEntryEvent extends VendureEntityEvent<HistoryEntry, HistoryInput> {
    readonly historyType: 'order' | 'customer' | string;
    constructor(ctx: RequestContext, entity: HistoryEntry, type: 'created' | 'updated' | 'deleted', historyType: 'order' | 'customer' | string, input?: HistoryInput);
}
export {};
