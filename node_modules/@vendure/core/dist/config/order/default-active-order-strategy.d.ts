import { RequestContext } from '../../api/common/request-context';
import { Injector } from '../../common/injector';
import { Order } from '../../entity/order/order.entity';
import { ActiveOrderStrategy } from './active-order-strategy';
/**
 * @description
 * The default {@link ActiveOrderStrategy}, which uses the current {@link Session} to determine
 * the active Order, and requires no additional input in the Shop API since it is based on the
 * session which is part of the RequestContext.
 *
 * @since 1.9.0
 * @docsCategory orders
 */
export declare class DefaultActiveOrderStrategy implements ActiveOrderStrategy {
    private connection;
    private orderService;
    private sessionService;
    name: 'default-active-order-strategy';
    init(injector: Injector): Promise<void>;
    createActiveOrder(ctx: RequestContext): Promise<Order>;
    determineActiveOrder(ctx: RequestContext): Promise<Order | undefined>;
}
