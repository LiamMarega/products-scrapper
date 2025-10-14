import { OrderLineInput } from '@vendure/common/lib/generated-types';
import { RequestContext } from '../../../api/common/request-context';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { Order } from '../../../entity/order/order.entity';
import { PaymentState } from '../payment-state-machine/payment-state';
/**
 * Returns true if the Order total is covered by Payments in the specified state.
 */
export declare function orderTotalIsCovered(order: Order, state: PaymentState | PaymentState[]): boolean;
/**
 * Returns the total amount covered by all Payments (minus any refunds)
 */
export declare function totalCoveredByPayments(order: Order, state?: PaymentState | PaymentState[]): number;
/**
 * Returns true if all (non-cancelled) OrderItems are delivered.
 */
export declare function orderItemsAreDelivered(order: Order): boolean;
/**
 * Returns true if at least one, but not all (non-cancelled) OrderItems are delivered.
 */
export declare function orderItemsArePartiallyDelivered(order: Order): boolean;
/**
 * Returns true if at least one, but not all (non-cancelled) OrderItems are shipped.
 */
export declare function orderItemsArePartiallyShipped(order: Order): boolean;
/**
 * Returns true if all (non-cancelled) OrderItems are shipped.
 */
export declare function orderItemsAreShipped(order: Order): boolean;
/**
 * Returns true if all OrderItems in the order are cancelled
 */
export declare function orderLinesAreAllCancelled(order: Order): boolean;
export declare function getOrdersFromLines(ctx: RequestContext, connection: TransactionalConnection, orderLinesInput: OrderLineInput[]): Promise<Order[]>;
