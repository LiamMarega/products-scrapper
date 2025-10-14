import { RequestContext } from '../../api/common/request-context';
import { Order } from '../../entity/order/order.entity';
import { MergedOrderLine, OrderMergeStrategy } from './order-merge-strategy';
/**
 * @description
 * Merges both Orders. If the guest order contains items which are already in the
 * existing Order, the guest Order quantity will replace that of the existing Order.
 *
 * @docsCategory orders
 * @docsPage Merge Strategies
 */
export declare class MergeOrdersStrategy implements OrderMergeStrategy {
    merge(ctx: RequestContext, guestOrder: Order, existingOrder: Order): MergedOrderLine[];
    private findCorrespondingLine;
}
