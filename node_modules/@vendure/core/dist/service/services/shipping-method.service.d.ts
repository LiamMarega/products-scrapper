import { AssignShippingMethodsToChannelInput, ConfigurableOperationDefinition, CreateShippingMethodInput, DeletionResponse, RemoveShippingMethodsFromChannelInput, UpdateShippingMethodInput } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/decorators/relations.decorator';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { ShippingMethod } from '../../entity/shipping-method/shipping-method.entity';
import { EventBus } from '../../event-bus';
import { ConfigArgService } from '../helpers/config-arg/config-arg.service';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { TranslatorService } from '../helpers/translator/translator.service';
import { ChannelService } from './channel.service';
import { RoleService } from './role.service';
/**
 * @description
 * Contains methods relating to {@link ShippingMethod} entities.
 *
 * @docsCategory services
 */
export declare class ShippingMethodService {
    private connection;
    private configService;
    private roleService;
    private listQueryBuilder;
    private channelService;
    private configArgService;
    private translatableSaver;
    private customFieldRelationService;
    private eventBus;
    private translator;
    constructor(connection: TransactionalConnection, configService: ConfigService, roleService: RoleService, listQueryBuilder: ListQueryBuilder, channelService: ChannelService, configArgService: ConfigArgService, translatableSaver: TranslatableSaver, customFieldRelationService: CustomFieldRelationService, eventBus: EventBus, translator: TranslatorService);
    /** @internal */
    initShippingMethods(): Promise<void>;
    findAll(ctx: RequestContext, options?: ListQueryOptions<ShippingMethod>, relations?: RelationPaths<ShippingMethod>): Promise<PaginatedList<Translated<ShippingMethod>>>;
    findOne(ctx: RequestContext, shippingMethodId: ID, includeDeleted?: boolean, relations?: RelationPaths<ShippingMethod>): Promise<Translated<ShippingMethod> | undefined>;
    create(ctx: RequestContext, input: CreateShippingMethodInput): Promise<Translated<ShippingMethod>>;
    update(ctx: RequestContext, input: UpdateShippingMethodInput): Promise<Translated<ShippingMethod>>;
    softDelete(ctx: RequestContext, id: ID): Promise<DeletionResponse>;
    assignShippingMethodsToChannel(ctx: RequestContext, input: AssignShippingMethodsToChannelInput): Promise<Array<Translated<ShippingMethod>>>;
    removeShippingMethodsFromChannel(ctx: RequestContext, input: RemoveShippingMethodsFromChannelInput): Promise<Array<Translated<ShippingMethod>>>;
    getShippingEligibilityCheckers(ctx: RequestContext): ConfigurableOperationDefinition[];
    getShippingCalculators(ctx: RequestContext): ConfigurableOperationDefinition[];
    getFulfillmentHandlers(ctx: RequestContext): ConfigurableOperationDefinition[];
    getActiveShippingMethods(ctx: RequestContext): Promise<ShippingMethod[]>;
    /**
     * Ensures that all ShippingMethods have a valid fulfillmentHandlerCode
     */
    private verifyShippingMethods;
    private ensureValidFulfillmentHandlerCode;
}
