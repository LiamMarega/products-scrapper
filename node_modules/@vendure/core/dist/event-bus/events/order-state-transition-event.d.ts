import { RequestContext } from '../../api/common/request-context';
import { Order } from '../../entity/order/order.entity';
import { OrderState } from '../../service/helpers/order-state-machine/order-state';
import { VendureEvent } from '../vendure-event';
/**
 * @description
 * This event is fired whenever an {@link Order} transitions from one {@link OrderState} to another.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export declare class OrderStateTransitionEvent extends VendureEvent {
    fromState: OrderState;
    toState: OrderState;
    ctx: RequestContext;
    order: Order;
    constructor(fromState: OrderState, toState: OrderState, ctx: RequestContext, order: Order);
}
