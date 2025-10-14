import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { OrderModification } from '../order-modification/order-modification.entity';
import { OrderLineReference } from './order-line-reference.entity';
/**
 * @description
 * This entity represents a line from an {@link Order} which has been modified by an {@link OrderModification}.
 *
 * @docsCategory entities
 * @docsPage OrderLineReference
 */
export declare class OrderModificationLine extends OrderLineReference {
    constructor(input?: DeepPartial<OrderModificationLine>);
    modification: OrderModification;
    modificationId: ID;
}
