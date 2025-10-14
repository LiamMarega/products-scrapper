import { RequestContext } from '../../../api/common/request-context';
import { ConfigService } from '../../../config/config.service';
import { Order } from '../../../entity/order/order.entity';
import { Payment } from '../../../entity/payment/payment.entity';
import { PaymentState } from './payment-state';
export declare class PaymentStateMachine {
    private configService;
    private readonly config;
    private readonly initialState;
    constructor(configService: ConfigService);
    getInitialState(): PaymentState;
    canTransition(currentState: PaymentState, newState: PaymentState): boolean;
    getNextStates(payment: Payment): readonly PaymentState[];
    transition(ctx: RequestContext, order: Order, payment: Payment, state: PaymentState): Promise<{
        finalize: () => Promise<any>;
    }>;
    private initConfig;
}
