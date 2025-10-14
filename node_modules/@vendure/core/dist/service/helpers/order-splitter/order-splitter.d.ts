import { RequestContext } from '../../../api/common/request-context';
import { ConfigService } from '../../../config/config.service';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { Order } from '../../../entity/order/order.entity';
import { ChannelService } from '../../services/channel.service';
import { OrderService } from '../../services/order.service';
export declare class OrderSplitter {
    private connection;
    private configService;
    private channelService;
    private orderService;
    constructor(connection: TransactionalConnection, configService: ConfigService, channelService: ChannelService, orderService: OrderService);
    createSellerOrders(ctx: RequestContext, order: Order): Promise<Order[]>;
    private duplicateOrderLine;
    private duplicateShippingLine;
}
