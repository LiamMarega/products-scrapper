import { RequestContext } from '../../../api/common/request-context';
import { StateMachineConfig } from '../../../common/finite-state-machine/types';
import { ConfigService } from '../../../config/config.service';
import { Order } from '../../../entity/order/order.entity';
import { OrderState, OrderTransitionData } from './order-state';
export declare class OrderStateMachine {
    private configService;
    readonly config: StateMachineConfig<OrderState, OrderTransitionData>;
    private readonly initialState;
    constructor(configService: ConfigService);
    getInitialState(): OrderState;
    canTransition(currentState: OrderState, newState: OrderState): boolean;
    getNextStates(order: Order): readonly OrderState[];
    transition(ctx: RequestContext, order: Order, state: OrderState): Promise<{
        finalize: () => Promise<any>;
    }>;
    private initConfig;
}
