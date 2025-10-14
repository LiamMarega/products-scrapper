import { TransactionalConnection } from '../../../connection/transactional-connection';
import { Fulfillment } from '../../../entity/fulfillment/fulfillment.entity';
import { OrderLine } from '../../../entity/order-line/order-line.entity';
import { FulfillmentLine } from '../../../entity/order-line-reference/fulfillment-line.entity';
import { RequestContext } from '../../common/request-context';
export declare class FulfillmentLineEntityResolver {
    private connection;
    constructor(connection: TransactionalConnection);
    orderLine(ctx: RequestContext, fulfillmentLine: FulfillmentLine): Promise<OrderLine | null>;
    fulfillment(ctx: RequestContext, fulfillmentLine: FulfillmentLine): Promise<Fulfillment | null>;
}
