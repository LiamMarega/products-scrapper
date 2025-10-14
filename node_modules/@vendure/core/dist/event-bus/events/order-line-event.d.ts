import { RequestContext } from '../../api/common/request-context';
import { Order, OrderLine } from '../../entity';
import { VendureEvent } from '../vendure-event';
/**
 * @description
 * This event is fired whenever an {@link OrderLine} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export declare class OrderLineEvent extends VendureEvent {
    ctx: RequestContext;
    order: Order;
    orderLine: OrderLine;
    type: 'created' | 'updated' | 'deleted' | 'cancelled';
    constructor(ctx: RequestContext, order: Order, orderLine: OrderLine, type: 'created' | 'updated' | 'deleted' | 'cancelled');
}
