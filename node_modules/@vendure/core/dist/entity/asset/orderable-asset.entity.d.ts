import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Orderable } from '../../common/types/common-types';
import { Asset } from '../asset/asset.entity';
import { VendureEntity } from '../base/base.entity';
/**
 * @description
 * This base class is extended in order to enable specific ordering of the one-to-many
 * Entity -> Assets relation. Using a many-to-many relation does not provide a way
 * to guarantee order of the Assets, so this entity is used in place of the
 * usual join table that would be created by TypeORM.
 * See https://typeorm.io/#/many-to-many-relations/many-to-many-relations-with-custom-properties
 *
 * @docsCategory entities
 */
export declare abstract class OrderableAsset extends VendureEntity implements Orderable {
    protected constructor(input?: DeepPartial<OrderableAsset>);
    assetId: ID;
    asset: Asset;
    position: number;
}
