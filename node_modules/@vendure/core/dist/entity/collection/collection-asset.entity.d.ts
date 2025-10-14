import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { OrderableAsset } from '../asset/orderable-asset.entity';
import { Collection } from './collection.entity';
export declare class CollectionAsset extends OrderableAsset {
    constructor(input?: DeepPartial<CollectionAsset>);
    collectionId: ID;
    collection: Collection;
}
