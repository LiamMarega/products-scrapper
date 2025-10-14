import { CreateChannelInput, CreateChannelResult, DeletionResponse, UpdateChannelInput, UpdateChannelResult } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList, Type } from '@vendure/common/lib/shared-types';
import { RelationPaths } from '../../api';
import { RequestContext } from '../../api/common/request-context';
import { ErrorResultUnion } from '../../common/error/error-result';
import { SelfRefreshingCache } from '../../common/self-refreshing-cache';
import { ChannelAware, ListQueryOptions } from '../../common/types/common-types';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { VendureEntity } from '../../entity/base/base.entity';
import { Channel } from '../../entity/channel/channel.entity';
import { EventBus } from '../../event-bus';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { GlobalSettingsService } from './global-settings.service';
/**
 * @description
 * Contains methods relating to {@link Channel} entities.
 *
 * @docsCategory services
 */
export declare class ChannelService {
    private connection;
    private configService;
    private globalSettingsService;
    private customFieldRelationService;
    private eventBus;
    private listQueryBuilder;
    private allChannels;
    constructor(connection: TransactionalConnection, configService: ConfigService, globalSettingsService: GlobalSettingsService, customFieldRelationService: CustomFieldRelationService, eventBus: EventBus, listQueryBuilder: ListQueryBuilder);
    /**
     * When the app is bootstrapped, ensure a default Channel exists and populate the
     * channel lookup array.
     *
     * @internal
     */
    initChannels(): Promise<void>;
    /**
     * Creates a channels cache, that can be used to reduce number of channel queries to database
     *
     * @internal
     */
    createCache(): Promise<SelfRefreshingCache<Channel[], [RequestContext]>>;
    /**
     * @description
     * Assigns a ChannelAware entity to the default Channel as well as any channel
     * specified in the RequestContext. This method will not save the entity to the database, but
     * assigns the `channels` property of the entity.
     */
    assignToCurrentChannel<T extends ChannelAware & VendureEntity>(entity: T, ctx: RequestContext): Promise<T>;
    /**
     * This method is used to bypass a bug with Typeorm when working with ManyToMany relationships.
     * For some reason, a regular query does not return all the channels that an entity has.
     * This is a most optimized way to get all the channels that an entity has.
     *
     * @param ctx - The RequestContext object.
     * @param entityType - The type of the entity.
     * @param entityId - The ID of the entity.
     * @returns A promise that resolves to an array of objects, each containing a channel ID.
     * @private
     */
    private getAssignedEntityChannels;
    /**
     * @description
     * Assigns the entity to the given Channels and saves all changes to the database.
     */
    assignToChannels<T extends ChannelAware & VendureEntity>(ctx: RequestContext, entityType: Type<T>, entityId: ID, channelIds: ID[]): Promise<T>;
    /**
     * @description
     * Removes the entity from the given Channels and saves.
     */
    removeFromChannels<T extends ChannelAware & VendureEntity>(ctx: RequestContext, entityType: Type<T>, entityId: ID, channelIds: ID[]): Promise<T | undefined>;
    /**
     * @description
     * Given a channel token, returns the corresponding Channel if it exists, else will throw
     * a {@link ChannelNotFoundError}.
     */
    getChannelFromToken(token: string): Promise<Channel>;
    getChannelFromToken(ctx: RequestContext, token: string): Promise<Channel>;
    /**
     * @description
     * Returns the default Channel.
     */
    getDefaultChannel(ctx?: RequestContext): Promise<Channel>;
    findAll(ctx: RequestContext, options?: ListQueryOptions<Channel>, relations?: RelationPaths<Channel>): Promise<PaginatedList<Channel>>;
    findOne(ctx: RequestContext, id: ID): Promise<Channel | undefined>;
    create(ctx: RequestContext, input: CreateChannelInput): Promise<ErrorResultUnion<CreateChannelResult, Channel>>;
    update(ctx: RequestContext, input: UpdateChannelInput): Promise<ErrorResultUnion<UpdateChannelResult, Channel>>;
    delete(ctx: RequestContext, id: ID): Promise<DeletionResponse>;
    /**
     * @description
     * Type guard method which returns true if the given entity is an
     * instance of a class which implements the {@link ChannelAware} interface.
     */
    isChannelAware(entity: VendureEntity): entity is VendureEntity & ChannelAware;
    /**
     * Ensures channel cache exists. If not, this method creates one.
     */
    private ensureCacheExists;
    /**
     * There must always be a default Channel. If none yet exists, this method creates one.
     * Also ensures the default Channel token matches the defaultChannelToken config setting.
     */
    private ensureDefaultChannelExists;
    private validateDefaultLanguageCode;
}
