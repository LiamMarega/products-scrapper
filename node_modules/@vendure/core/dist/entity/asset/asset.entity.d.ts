import { AssetType } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { ChannelAware, Taggable } from '../../common/types/common-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { Collection } from '../collection/collection.entity';
import { CustomAssetFields } from '../custom-entity-fields';
import { Product } from '../product/product.entity';
import { ProductVariant } from '../product-variant/product-variant.entity';
import { Tag } from '../tag/tag.entity';
/**
 * @description
 * An Asset represents a file such as an image which can be associated with certain other entities
 * such as Products.
 *
 * @docsCategory entities
 */
export declare class Asset extends VendureEntity implements Taggable, ChannelAware, HasCustomFields {
    constructor(input?: DeepPartial<Asset>);
    name: string;
    type: AssetType;
    mimeType: string;
    width: number;
    height: number;
    fileSize: number;
    source: string;
    preview: string;
    focalPoint?: {
        x: number;
        y: number;
    };
    tags: Tag[];
    channels: Channel[];
    featuredInCollections?: Collection[];
    featuredInVariants?: ProductVariant[];
    featuredInProducts?: Product[];
    customFields: CustomAssetFields;
}
