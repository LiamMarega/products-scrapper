import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Order } from '../order/order.entity';
import { HistoryEntry } from './history-entry.entity';
/**
 * @description
 * Represents an event in the history of a particular {@link Order}.
 *
 * @docsCategory entities
 */
export declare class OrderHistoryEntry extends HistoryEntry {
    constructor(input: DeepPartial<OrderHistoryEntry>);
    order: Order;
}
