import { ConfigurableOperationDefinition, DeletionResponse, MutationAssignCollectionsToChannelArgs, MutationCreateCollectionArgs, MutationDeleteCollectionArgs, MutationDeleteCollectionsArgs, MutationMoveCollectionArgs, MutationRemoveCollectionsFromChannelArgs, MutationUpdateCollectionArgs, QueryCollectionArgs, QueryCollectionsArgs, QueryPreviewCollectionVariantsArgs } from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';
import { Translated } from '../../../common/types/locale-types';
import { Collection } from '../../../entity/collection/collection.entity';
import { CollectionService } from '../../../service/services/collection.service';
import { FacetValueService } from '../../../service/services/facet-value.service';
import { ConfigurableOperationCodec } from '../../common/configurable-operation-codec';
import { RequestContext } from '../../common/request-context';
import { RelationPaths } from '../../decorators/relations.decorator';
export declare class CollectionResolver {
    private collectionService;
    private facetValueService;
    private configurableOperationCodec;
    constructor(collectionService: CollectionService, facetValueService: FacetValueService, configurableOperationCodec: ConfigurableOperationCodec);
    collectionFilters(ctx: RequestContext, args: QueryCollectionsArgs): Promise<ConfigurableOperationDefinition[]>;
    collections(ctx: RequestContext, args: QueryCollectionsArgs, relations: RelationPaths<Collection>): Promise<PaginatedList<Translated<Collection>>>;
    collection(ctx: RequestContext, args: QueryCollectionArgs, relations: RelationPaths<Collection>): Promise<Translated<Collection> | undefined>;
    previewCollectionVariants(ctx: RequestContext, args: QueryPreviewCollectionVariantsArgs): Promise<PaginatedList<import("../../..").ProductVariant>>;
    createCollection(ctx: RequestContext, args: MutationCreateCollectionArgs): Promise<Translated<Collection>>;
    updateCollection(ctx: RequestContext, args: MutationUpdateCollectionArgs): Promise<Translated<Collection>>;
    moveCollection(ctx: RequestContext, args: MutationMoveCollectionArgs): Promise<Translated<Collection>>;
    deleteCollection(ctx: RequestContext, args: MutationDeleteCollectionArgs): Promise<DeletionResponse>;
    deleteCollections(ctx: RequestContext, args: MutationDeleteCollectionsArgs): Promise<DeletionResponse[]>;
    assignCollectionsToChannel(ctx: RequestContext, args: MutationAssignCollectionsToChannelArgs): Promise<Array<Translated<Collection>>>;
    removeCollectionsFromChannel(ctx: RequestContext, args: MutationRemoveCollectionsFromChannelArgs): Promise<Array<Translated<Collection>>>;
}
