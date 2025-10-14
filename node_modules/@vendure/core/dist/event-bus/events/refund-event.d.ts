import { RequestContext } from '../../api/common/request-context';
import { Order, Refund } from '../../entity';
import { VendureEvent } from '../vendure-event';
/**
 * @description
 * This event is fired whenever a {@link Refund} is created
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export declare class RefundEvent extends VendureEvent {
    ctx: RequestContext;
    order: Order;
    refund: Refund;
    type: 'created';
    constructor(ctx: RequestContext, order: Order, refund: Refund, type: 'created');
}
