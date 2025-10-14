import { RequestContext } from '../../../api/common/request-context';
import { StateMachineConfig } from '../../../common/finite-state-machine/types';
import { ConfigService } from '../../../config/config.service';
import { Fulfillment } from '../../../entity/fulfillment/fulfillment.entity';
import { Order } from '../../../entity/order/order.entity';
import { FulfillmentState, FulfillmentTransitionData } from './fulfillment-state';
export declare class FulfillmentStateMachine {
    private configService;
    readonly config: StateMachineConfig<FulfillmentState, FulfillmentTransitionData>;
    private readonly initialState;
    constructor(configService: ConfigService);
    getInitialState(): FulfillmentState;
    canTransition(currentState: FulfillmentState, newState: FulfillmentState): boolean;
    getNextStates(fulfillment: Fulfillment): readonly FulfillmentState[];
    transition(ctx: RequestContext, fulfillment: Fulfillment, orders: Order[], state: FulfillmentState): Promise<{
        finalize: () => Promise<any>;
    }>;
    private initConfig;
}
