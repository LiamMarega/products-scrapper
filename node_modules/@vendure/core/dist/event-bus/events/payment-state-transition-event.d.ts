import { RequestContext } from '../../api/common/request-context';
import { Order } from '../../entity/order/order.entity';
import { Payment } from '../../entity/payment/payment.entity';
import { PaymentState } from '../../service/helpers/payment-state-machine/payment-state';
import { VendureEvent } from '../vendure-event';
/**
 * @description
 * This event is fired whenever a {@link Payment} transitions from one {@link PaymentState} to another, e.g.
 * a Payment is authorized by the payment provider.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export declare class PaymentStateTransitionEvent extends VendureEvent {
    fromState: PaymentState;
    toState: PaymentState;
    ctx: RequestContext;
    payment: Payment;
    order: Order;
    constructor(fromState: PaymentState, toState: PaymentState, ctx: RequestContext, payment: Payment, order: Order);
}
