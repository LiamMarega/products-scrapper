import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { ChannelAware, SoftDeletable } from '../../common/types/common-types';
import { LocaleString, Translatable, Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { Asset } from '../asset/asset.entity';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomProductFields } from '../custom-entity-fields';
import { FacetValue } from '../facet-value/facet-value.entity';
import { ProductOptionGroup } from '../product-option-group/product-option-group.entity';
import { ProductVariant } from '../product-variant/product-variant.entity';
import { ProductAsset } from './product-asset.entity';
/**
 * @description
 * A Product contains one or more {@link ProductVariant}s and serves as a container for those variants,
 * providing an overall name, description etc.
 *
 * @docsCategory entities
 */
export declare class Product extends VendureEntity implements Translatable, HasCustomFields, ChannelAware, SoftDeletable {
    constructor(input?: DeepPartial<Product>);
    deletedAt: Date | null;
    name: LocaleString;
    slug: LocaleString;
    description: LocaleString;
    enabled: boolean;
    featuredAsset: Asset;
    featuredAssetId: ID;
    assets: ProductAsset[];
    translations: Array<Translation<Product>>;
    variants: ProductVariant[];
    optionGroups: ProductOptionGroup[];
    facetValues: FacetValue[];
    channels: Channel[];
    customFields: CustomProductFields;
}
