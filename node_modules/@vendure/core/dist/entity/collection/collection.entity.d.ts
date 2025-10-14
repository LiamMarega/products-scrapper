import { ConfigurableOperation } from '@vendure/common/lib/generated-types';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { ChannelAware, Orderable } from '../../common/types/common-types';
import { LocaleString, Translatable, Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { Asset } from '../asset/asset.entity';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomCollectionFields } from '../custom-entity-fields';
import { ProductVariant } from '../product-variant/product-variant.entity';
import { CollectionAsset } from './collection-asset.entity';
/**
 * @description
 * A Collection is a grouping of {@link Product}s based on various configurable criteria.
 *
 * @docsCategory entities
 */
export declare class Collection extends VendureEntity implements Translatable, HasCustomFields, ChannelAware, Orderable {
    constructor(input?: DeepPartial<Collection>);
    isRoot: boolean;
    position: number;
    isPrivate: boolean;
    name: LocaleString;
    description: LocaleString;
    slug: LocaleString;
    translations: Array<Translation<Collection>>;
    featuredAsset: Asset;
    assets: CollectionAsset[];
    filters: ConfigurableOperation[];
    /**
     * @since 2.0.0
     */
    inheritFilters: boolean;
    productVariants: ProductVariant[];
    customFields: CustomCollectionFields;
    children: Collection[];
    parent: Collection;
    parentId: ID;
    channels: Channel[];
}
