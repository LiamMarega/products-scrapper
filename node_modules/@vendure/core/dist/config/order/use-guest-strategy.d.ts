import { RequestContext } from '../../api/common/request-context';
import { Order } from '../../entity/order/order.entity';
import { MergedOrderLine, OrderMergeStrategy } from './order-merge-strategy';
/**
 * @description
 * Any existing order is discarded and the guest order is set as the active order.
 *
 * @docsCategory orders
 * @docsPage Merge Strategies
 */
export declare class UseGuestStrategy implements OrderMergeStrategy {
    merge(ctx: RequestContext, guestOrder: Order, existingOrder: Order): MergedOrderLine[];
}
