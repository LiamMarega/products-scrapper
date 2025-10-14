import { RequestContext } from '../../../api/common/request-context';
import { ConfigService } from '../../../config/config.service';
import { Order } from '../../../entity/order/order.entity';
import { Refund } from '../../../entity/refund/refund.entity';
import { RefundState } from './refund-state';
export declare class RefundStateMachine {
    private configService;
    private readonly config;
    private readonly initialState;
    constructor(configService: ConfigService);
    getInitialState(): RefundState;
    getNextStates(refund: Refund): readonly RefundState[];
    transition(ctx: RequestContext, order: Order, refund: Refund, state: RefundState): Promise<{
        finalize: () => Promise<any>;
    }>;
    private initConfig;
}
