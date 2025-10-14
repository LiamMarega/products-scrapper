import { ManualPaymentInput, RefundOrderInput } from '@vendure/common/lib/generated-types';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { PaymentStateTransitionError, RefundAmountError, RefundStateTransitionError } from '../../common/error/generated-graphql-admin-errors';
import { IneligiblePaymentMethodError } from '../../common/error/generated-graphql-shop-errors';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Order } from '../../entity/order/order.entity';
import { Payment } from '../../entity/payment/payment.entity';
import { Refund } from '../../entity/refund/refund.entity';
import { EventBus } from '../../event-bus/event-bus';
import { PaymentState } from '../helpers/payment-state-machine/payment-state';
import { PaymentStateMachine } from '../helpers/payment-state-machine/payment-state-machine';
import { RefundStateMachine } from '../helpers/refund-state-machine/refund-state-machine';
import { PaymentMethodService } from './payment-method.service';
/**
 * @description
 * Contains methods relating to {@link Payment} entities.
 *
 * @docsCategory services
 */
export declare class PaymentService {
    private connection;
    private paymentStateMachine;
    private refundStateMachine;
    private paymentMethodService;
    private eventBus;
    constructor(connection: TransactionalConnection, paymentStateMachine: PaymentStateMachine, refundStateMachine: RefundStateMachine, paymentMethodService: PaymentMethodService, eventBus: EventBus);
    create(ctx: RequestContext, input: DeepPartial<Payment>): Promise<Payment>;
    findOneOrThrow(ctx: RequestContext, id: ID, relations?: string[]): Promise<Payment>;
    /**
     * @description
     * Transitions a Payment to the given state.
     *
     * When updating a Payment in the context of an Order, it is
     * preferable to use the {@link OrderService} `transitionPaymentToState()` method, which will also handle
     * updating the Order state too.
     */
    transitionToState(ctx: RequestContext, paymentId: ID, state: PaymentState): Promise<Payment | PaymentStateTransitionError>;
    getNextStates(payment: Payment): readonly PaymentState[];
    /**
     * @description
     * Creates a new Payment.
     *
     * When creating a Payment in the context of an Order, it is
     * preferable to use the {@link OrderService} `addPaymentToOrder()` method, which will also handle
     * updating the Order state too.
     */
    createPayment(ctx: RequestContext, order: Order, amount: number, method: string, metadata: any): Promise<Payment | IneligiblePaymentMethodError>;
    /**
     * @description
     * Settles a Payment.
     *
     * When settling a Payment in the context of an Order, it is
     * preferable to use the {@link OrderService} `settlePayment()` method, which will also handle
     * updating the Order state too.
     */
    settlePayment(ctx: RequestContext, paymentId: ID): Promise<PaymentStateTransitionError | Payment>;
    cancelPayment(ctx: RequestContext, paymentId: ID): Promise<PaymentStateTransitionError | Payment>;
    private transitionStateAndSave;
    /**
     * @description
     * Creates a Payment from the manual payment mutation in the Admin API
     *
     * When creating a manual Payment in the context of an Order, it is
     * preferable to use the {@link OrderService} `addManualPaymentToOrder()` method, which will also handle
     * updating the Order state too.
     */
    createManualPayment(ctx: RequestContext, order: Order, amount: number, input: ManualPaymentInput): Promise<Payment>;
    /**
     * @description
     * Creates a Refund against the specified Payment. If the amount to be refunded exceeds the value of the
     * specified Payment (in the case of multiple payments on a single Order), then the remaining outstanding
     * refund amount will be refunded against the next available Payment from the Order.
     *
     * When creating a Refund in the context of an Order, it is
     * preferable to use the {@link OrderService} `refundOrder()` method, which performs additional
     * validation.
     */
    createRefund(ctx: RequestContext, input: RefundOrderInput, order: Order, selectedPayment: Payment): Promise<Refund | RefundStateTransitionError | RefundAmountError>;
    /**
     * @description
     * Returns the total amount of all Refunds against the given Payment.
     */
    private getPaymentRefundTotal;
    private getRefundAmount;
    private mergePaymentMetadata;
}
