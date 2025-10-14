import { ConfigurableOperationDefinition, DeletionResponse, MutationAssignPaymentMethodsToChannelArgs, MutationCreatePaymentMethodArgs, MutationDeletePaymentMethodArgs, MutationDeletePaymentMethodsArgs, MutationRemovePaymentMethodsFromChannelArgs, MutationUpdatePaymentMethodArgs, QueryPaymentMethodArgs, QueryPaymentMethodsArgs } from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';
import { Translated } from '../../../common/types/locale-types';
import { PaymentMethod } from '../../../entity/payment-method/payment-method.entity';
import { PaymentMethodService } from '../../../service/services/payment-method.service';
import { RequestContext } from '../../common/request-context';
import { RelationPaths } from '../../decorators/relations.decorator';
export declare class PaymentMethodResolver {
    private paymentMethodService;
    constructor(paymentMethodService: PaymentMethodService);
    paymentMethods(ctx: RequestContext, args: QueryPaymentMethodsArgs, relations: RelationPaths<PaymentMethod>): Promise<PaginatedList<PaymentMethod>>;
    paymentMethod(ctx: RequestContext, args: QueryPaymentMethodArgs, relations: RelationPaths<PaymentMethod>): Promise<PaymentMethod | undefined>;
    createPaymentMethod(ctx: RequestContext, args: MutationCreatePaymentMethodArgs): Promise<PaymentMethod>;
    updatePaymentMethod(ctx: RequestContext, args: MutationUpdatePaymentMethodArgs): Promise<PaymentMethod>;
    deletePaymentMethod(ctx: RequestContext, args: MutationDeletePaymentMethodArgs): Promise<DeletionResponse>;
    deletePaymentMethods(ctx: RequestContext, args: MutationDeletePaymentMethodsArgs): Promise<DeletionResponse[]>;
    paymentMethodHandlers(ctx: RequestContext): ConfigurableOperationDefinition[];
    paymentMethodEligibilityCheckers(ctx: RequestContext): ConfigurableOperationDefinition[];
    assignPaymentMethodsToChannel(ctx: RequestContext, args: MutationAssignPaymentMethodsToChannelArgs): Promise<Array<Translated<PaymentMethod>>>;
    removePaymentMethodsFromChannel(ctx: RequestContext, args: MutationRemovePaymentMethodsFromChannelArgs): Promise<Array<Translated<PaymentMethod>>>;
}
