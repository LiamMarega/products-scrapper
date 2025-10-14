import { CreateFacetValueInput, CreateFacetValueWithFacetInput, DeletionResponse, LanguageCode, UpdateFacetValueInput } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/decorators/relations.decorator';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { FacetValue } from '../../entity/facet-value/facet-value.entity';
import { Facet } from '../../entity/facet/facet.entity';
import { EventBus } from '../../event-bus';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { TranslatorService } from '../helpers/translator/translator.service';
import { ChannelService } from './channel.service';
/**
 * @description
 * Contains methods relating to {@link FacetValue} entities.
 *
 * @docsCategory services
 */
export declare class FacetValueService {
    private connection;
    private translatableSaver;
    private configService;
    private customFieldRelationService;
    private channelService;
    private eventBus;
    private translator;
    private listQueryBuilder;
    constructor(connection: TransactionalConnection, translatableSaver: TranslatableSaver, configService: ConfigService, customFieldRelationService: CustomFieldRelationService, channelService: ChannelService, eventBus: EventBus, translator: TranslatorService, listQueryBuilder: ListQueryBuilder);
    /**
     * @deprecated Use {@link FacetValueService.findAll findAll(ctx, lang)} instead
     */
    findAll(lang: LanguageCode): Promise<Array<Translated<FacetValue>>>;
    findAll(ctx: RequestContext, lang: LanguageCode): Promise<Array<Translated<FacetValue>>>;
    /**
     * @description
     * Returns a PaginatedList of FacetValues.
     *
     * TODO: in v2 this should replace the `findAll()` method.
     * A separate method was created just to avoid a breaking change in v1.9.
     */
    findAllList(ctx: RequestContext, options?: ListQueryOptions<FacetValue>, relations?: RelationPaths<FacetValue>): Promise<PaginatedList<Translated<FacetValue>>>;
    findOne(ctx: RequestContext, id: ID): Promise<Translated<FacetValue> | undefined>;
    findByIds(ctx: RequestContext, ids: ID[]): Promise<Array<Translated<FacetValue>>>;
    /**
     * @description
     * Returns all FacetValues belonging to the Facet with the given id.
     */
    findByFacetId(ctx: RequestContext, id: ID): Promise<Array<Translated<FacetValue>>>;
    /**
     * @description
     * Returns all FacetValues belonging to the Facet with the given id.
     */
    findByFacetIdList(ctx: RequestContext, id: ID, options?: ListQueryOptions<FacetValue>, relations?: RelationPaths<FacetValue>): Promise<PaginatedList<Translated<FacetValue>>>;
    create(ctx: RequestContext, facet: Facet, input: CreateFacetValueInput | CreateFacetValueWithFacetInput): Promise<Translated<FacetValue>>;
    update(ctx: RequestContext, input: UpdateFacetValueInput): Promise<Translated<FacetValue>>;
    delete(ctx: RequestContext, id: ID, force?: boolean): Promise<DeletionResponse>;
    /**
     * @description
     * Checks for usage of the given FacetValues in any Products or Variants, and returns the counts.
     */
    checkFacetValueUsage(ctx: RequestContext, facetValueIds: ID[], channelId?: ID): Promise<{
        productCount: number;
        variantCount: number;
    }>;
}
