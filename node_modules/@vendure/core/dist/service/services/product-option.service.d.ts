import { CreateGroupOptionInput, CreateProductOptionInput, DeletionResponse, UpdateProductOptionInput } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { Translated } from '../../common/types/locale-types';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { ProductOption } from '../../entity/product-option/product-option.entity';
import { EventBus } from '../../event-bus';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { TranslatorService } from '../helpers/translator/translator.service';
/**
 * @description
 * Contains methods relating to {@link ProductOption} entities.
 *
 * @docsCategory services
 */
export declare class ProductOptionService {
    private connection;
    private translatableSaver;
    private customFieldRelationService;
    private eventBus;
    private translator;
    constructor(connection: TransactionalConnection, translatableSaver: TranslatableSaver, customFieldRelationService: CustomFieldRelationService, eventBus: EventBus, translator: TranslatorService);
    findAll(ctx: RequestContext): Promise<Array<Translated<ProductOption>>>;
    findOne(ctx: RequestContext, id: ID): Promise<Translated<ProductOption> | undefined>;
    create(ctx: RequestContext, group: ProductOptionGroup | ID, input: CreateGroupOptionInput | CreateProductOptionInput): Promise<Translated<ProductOption>>;
    update(ctx: RequestContext, input: UpdateProductOptionInput): Promise<Translated<ProductOption>>;
    /**
     * @description
     * Deletes a ProductOption.
     *
     * - If the ProductOption is used by any ProductVariants, the deletion will fail.
     * - If the ProductOption is used only by soft-deleted ProductVariants, the option will itself
     *   be soft-deleted.
     * - If the ProductOption is not used by any ProductVariant at all, it will be hard-deleted.
     */
    delete(ctx: RequestContext, id: ID): Promise<DeletionResponse>;
    private isInUse;
}
