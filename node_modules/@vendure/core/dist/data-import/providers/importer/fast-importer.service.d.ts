import { CreateProductInput, CreateProductOptionGroupInput, CreateProductOptionInput, CreateProductVariantInput } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { Channel } from '../../../entity/channel/channel.entity';
import { RequestContextService } from '../../../service/helpers/request-context/request-context.service';
import { TranslatableSaver } from '../../../service/helpers/translatable-saver/translatable-saver';
import { ChannelService } from '../../../service/services/channel.service';
import { StockMovementService } from '../../../service/services/stock-movement.service';
/**
 * @description
 * A service to import entities into the database. This replaces the regular `create` methods of the service layer with faster
 * versions which skip much of the defensive checks and other DB calls which are not needed when running an import. It also
 * does not publish any events, so e.g. will not trigger search index jobs.
 *
 * In testing, the use of the FastImporterService approximately doubled the speed of bulk imports.
 *
 * @docsCategory import-export
 */
export declare class FastImporterService {
    private connection;
    private channelService;
    private stockMovementService;
    private translatableSaver;
    private requestContextService;
    private defaultChannel;
    private importCtx;
    /** @internal */
    constructor(connection: TransactionalConnection, channelService: ChannelService, stockMovementService: StockMovementService, translatableSaver: TranslatableSaver, requestContextService: RequestContextService);
    /**
     * @description
     * This should be called prior to any of the import methods, as it establishes the
     * default Channel as well as the context in which the new entities will be created.
     *
     * Passing a `channel` argument means that Products and ProductVariants will be assigned
     * to that Channel.
     */
    initialize(channel?: Channel): Promise<void>;
    createProduct(input: CreateProductInput): Promise<ID>;
    createProductOptionGroup(input: CreateProductOptionGroupInput): Promise<ID>;
    createProductOption(input: CreateProductOptionInput): Promise<ID>;
    addOptionGroupToProduct(productId: ID, optionGroupId: ID): Promise<void>;
    createProductVariant(input: CreateProductVariantInput): Promise<ID>;
    private ensureInitialized;
}
