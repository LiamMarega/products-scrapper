import { CreateTaxCategoryInput, DeletionResponse, UpdateTaxCategoryInput } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { ListQueryOptions } from '../../common/types/common-types';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { TaxCategory } from '../../entity/tax-category/tax-category.entity';
import { EventBus } from '../../event-bus';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
/**
 * @description
 * Contains methods relating to {@link TaxCategory} entities.
 *
 * @docsCategory services
 */
export declare class TaxCategoryService {
    private connection;
    private eventBus;
    private listQueryBuilder;
    constructor(connection: TransactionalConnection, eventBus: EventBus, listQueryBuilder: ListQueryBuilder);
    findAll(ctx: RequestContext, options?: ListQueryOptions<TaxCategory>): Promise<PaginatedList<TaxCategory>>;
    findOne(ctx: RequestContext, taxCategoryId: ID): Promise<TaxCategory | undefined>;
    create(ctx: RequestContext, input: CreateTaxCategoryInput): Promise<TaxCategory>;
    update(ctx: RequestContext, input: UpdateTaxCategoryInput): Promise<TaxCategory>;
    delete(ctx: RequestContext, id: ID): Promise<DeletionResponse>;
}
