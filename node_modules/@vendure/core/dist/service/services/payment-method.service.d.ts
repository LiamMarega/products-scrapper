import { PaymentMethodQuote } from '@vendure/common/lib/generated-shop-types';
import { AssignPaymentMethodsToChannelInput, ConfigurableOperationDefinition, CreatePaymentMethodInput, DeletionResponse, RemovePaymentMethodsFromChannelInput, UpdatePaymentMethodInput } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/decorators/relations.decorator';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { ConfigService } from '../../config/config.service';
import { PaymentMethodEligibilityChecker } from '../../config/payment/payment-method-eligibility-checker';
import { PaymentMethodHandler } from '../../config/payment/payment-method-handler';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Order } from '../../entity/order/order.entity';
import { PaymentMethod } from '../../entity/payment-method/payment-method.entity';
import { EventBus } from '../../event-bus/event-bus';
import { ConfigArgService } from '../helpers/config-arg/config-arg.service';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { TranslatorService } from '../helpers/translator/translator.service';
import { ChannelService } from './channel.service';
import { RoleService } from './role.service';
/**
 * @description
 * Contains methods relating to {@link PaymentMethod} entities.
 *
 * @docsCategory services
 */
export declare class PaymentMethodService {
    private connection;
    private configService;
    private roleService;
    private listQueryBuilder;
    private eventBus;
    private configArgService;
    private channelService;
    private customFieldRelationService;
    private translatableSaver;
    private translator;
    constructor(connection: TransactionalConnection, configService: ConfigService, roleService: RoleService, listQueryBuilder: ListQueryBuilder, eventBus: EventBus, configArgService: ConfigArgService, channelService: ChannelService, customFieldRelationService: CustomFieldRelationService, translatableSaver: TranslatableSaver, translator: TranslatorService);
    findAll(ctx: RequestContext, options?: ListQueryOptions<PaymentMethod>, relations?: RelationPaths<PaymentMethod>): Promise<PaginatedList<PaymentMethod>>;
    findOne(ctx: RequestContext, paymentMethodId: ID, relations?: RelationPaths<PaymentMethod>): Promise<PaymentMethod | undefined>;
    create(ctx: RequestContext, input: CreatePaymentMethodInput): Promise<PaymentMethod>;
    update(ctx: RequestContext, input: UpdatePaymentMethodInput): Promise<PaymentMethod>;
    delete(ctx: RequestContext, paymentMethodId: ID, force?: boolean): Promise<DeletionResponse>;
    assignPaymentMethodsToChannel(ctx: RequestContext, input: AssignPaymentMethodsToChannelInput): Promise<Array<Translated<PaymentMethod>>>;
    removePaymentMethodsFromChannel(ctx: RequestContext, input: RemovePaymentMethodsFromChannelInput): Promise<Array<Translated<PaymentMethod>>>;
    getPaymentMethodEligibilityCheckers(ctx: RequestContext): ConfigurableOperationDefinition[];
    getPaymentMethodHandlers(ctx: RequestContext): ConfigurableOperationDefinition[];
    getEligiblePaymentMethods(ctx: RequestContext, order: Order): Promise<PaymentMethodQuote[]>;
    getMethodAndOperations(ctx: RequestContext, method: string): Promise<{
        paymentMethod: PaymentMethod;
        handler: PaymentMethodHandler;
        checker: PaymentMethodEligibilityChecker | null;
    }>;
    getActivePaymentMethods(ctx: RequestContext): Promise<PaymentMethod[]>;
}
