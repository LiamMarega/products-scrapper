import { ID } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../../api/common/request-context';
import { ConfigService } from '../../../config/config.service';
import { Order } from '../../../entity/order/order.entity';
import { OrderLine } from '../../../entity/order-line/order-line.entity';
export type OrderWithNoLines = Order & {
    lines: undefined;
};
export type OrderWithEmptyLines = Order & {
    lines: ArrayLike<OrderLine> & {
        length: 0;
    };
};
export type EmptyOrder = OrderWithEmptyLines | OrderWithNoLines;
export type MergeResult = {
    order?: Order;
    linesToInsert?: Array<{
        productVariantId: ID;
        quantity: number;
        customFields?: any;
    }>;
    linesToModify?: Array<{
        orderLineId: ID;
        quantity: number;
        customFields?: any;
    }>;
    linesToDelete?: Array<{
        orderLineId: ID;
    }>;
    orderToDelete?: Order;
};
export declare class OrderMerger {
    private configService;
    constructor(configService: ConfigService);
    /**
     * Applies the configured OrderMergeStrategy to the supplied guestOrder and existingOrder. Returns an object
     * containing entities which then need to be persisted to the database by the OrderService methods.
     */
    merge(ctx: RequestContext, guestOrder?: Order, existingOrder?: Order): MergeResult;
    private getLinesToInsert;
    private getLinesToModify;
    private getLinesToDelete;
    private orderEmpty;
}
