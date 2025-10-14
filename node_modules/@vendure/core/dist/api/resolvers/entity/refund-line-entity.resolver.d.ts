import { TransactionalConnection } from '../../../connection/transactional-connection';
import { OrderLine } from '../../../entity/order-line/order-line.entity';
import { RefundLine } from '../../../entity/order-line-reference/refund-line.entity';
import { Refund } from '../../../entity/refund/refund.entity';
import { RequestContext } from '../../common/request-context';
export declare class RefundLineEntityResolver {
    private connection;
    constructor(connection: TransactionalConnection);
    orderLine(ctx: RequestContext, refundLine: RefundLine): Promise<OrderLine>;
    refund(ctx: RequestContext, refundLine: RefundLine): Promise<Refund>;
}
