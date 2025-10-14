import { CreateSellerInput, DeletionResponse, UpdateSellerInput } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { ListQueryOptions } from '../../common/types/common-types';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Seller } from '../../entity/seller/seller.entity';
import { EventBus } from '../../event-bus/index';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
/**
 * @description
 * Contains methods relating to {@link Seller} entities.
 *
 * @docsCategory services
 */
export declare class SellerService {
    private connection;
    private listQueryBuilder;
    private eventBus;
    private customFieldRelationService;
    constructor(connection: TransactionalConnection, listQueryBuilder: ListQueryBuilder, eventBus: EventBus, customFieldRelationService: CustomFieldRelationService);
    initSellers(): Promise<void>;
    findAll(ctx: RequestContext, options?: ListQueryOptions<Seller>): Promise<PaginatedList<Seller>>;
    findOne(ctx: RequestContext, sellerId: ID): Promise<Seller | undefined>;
    create(ctx: RequestContext, input: CreateSellerInput): Promise<Seller>;
    update(ctx: RequestContext, input: UpdateSellerInput): Promise<Seller>;
    delete(ctx: RequestContext, id: ID): Promise<DeletionResponse>;
    private ensureDefaultSellerExists;
}
