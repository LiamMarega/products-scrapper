import { CreateTagInput, DeletionResponse, UpdateTagInput } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList, Type } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { ListQueryOptions, Taggable } from '../../common/types/common-types';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { VendureEntity } from '../../entity/base/base.entity';
import { Tag } from '../../entity/tag/tag.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
/**
 * @description
 * Contains methods relating to {@link Tag} entities.
 *
 * @docsCategory services
 */
export declare class TagService {
    private connection;
    private listQueryBuilder;
    constructor(connection: TransactionalConnection, listQueryBuilder: ListQueryBuilder);
    findAll(ctx: RequestContext, options?: ListQueryOptions<Tag>): Promise<PaginatedList<Tag>>;
    findOne(ctx: RequestContext, tagId: ID): Promise<Tag | undefined>;
    create(ctx: RequestContext, input: CreateTagInput): Promise<Tag>;
    update(ctx: RequestContext, input: UpdateTagInput): Promise<Tag>;
    delete(ctx: RequestContext, id: ID): Promise<DeletionResponse>;
    valuesToTags(ctx: RequestContext, values: string[]): Promise<Tag[]>;
    getTagsForEntity(ctx: RequestContext, entity: Type<VendureEntity & Taggable>, id: ID): Promise<Tag[]>;
    private tagValueToTag;
}
