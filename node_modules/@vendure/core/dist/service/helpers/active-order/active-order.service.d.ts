import { RequestContext } from '../../../api/common/request-context';
import { ConfigService } from '../../../config/config.service';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { Order } from '../../../entity/order/order.entity';
import { OrderService } from '../../services/order.service';
import { SessionService } from '../../services/session.service';
/**
 * @description
 * This helper class is used to get a reference to the active Order from the current RequestContext.
 *
 * @docsCategory orders
 */
export declare class ActiveOrderService {
    private sessionService;
    private orderService;
    private connection;
    private configService;
    constructor(sessionService: SessionService, orderService: OrderService, connection: TransactionalConnection, configService: ConfigService);
    /**
     * @description
     * Gets the active Order object from the current Session. Optionally can create a new Order if
     * no active Order exists.
     *
     * Intended to be used at the Resolver layer for those resolvers that depend upon an active Order
     * being present.
     *
     * @deprecated From v1.9.0, use the `getActiveOrder` method which uses any configured ActiveOrderStrategies
     */
    getOrderFromContext(ctx: RequestContext): Promise<Order | undefined>;
    getOrderFromContext(ctx: RequestContext, createIfNotExists: true): Promise<Order>;
    /**
     * @description
     * Retrieves the active Order based on the configured {@link ActiveOrderStrategy}.
     *
     * @since 1.9.0
     */
    getActiveOrder(ctx: RequestContext, input: {
        [strategyName: string]: any;
    } | undefined): Promise<Order | undefined>;
    getActiveOrder(ctx: RequestContext, input: {
        [strategyName: string]: any;
    } | undefined, createIfNotExists: true): Promise<Order>;
}
