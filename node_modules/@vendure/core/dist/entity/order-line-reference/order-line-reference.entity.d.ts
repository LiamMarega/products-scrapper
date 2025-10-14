import { ID } from '@vendure/common/lib/shared-types';
import { VendureEntity } from '../base/base.entity';
import { OrderLine } from '../order-line/order-line.entity';
/**
 * @description
 * This is an abstract base class for entities which reference an {@link OrderLine}.
 *
 * @docsCategory entities
 * @docsPage OrderLineReference
 */
export declare abstract class OrderLineReference extends VendureEntity {
    quantity: number;
    orderLine: OrderLine;
    orderLineId: ID;
}
