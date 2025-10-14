import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { ChannelAware } from '../../common/types/common-types';
import { LocaleString, Translatable, Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomFacetValueFields } from '../custom-entity-fields';
import { Facet } from '../facet/facet.entity';
import { Product } from '../product/product.entity';
import { ProductVariant } from '../product-variant/product-variant.entity';
/**
 * @description
 * A particular value of a {@link Facet}.
 *
 * @docsCategory entities
 */
export declare class FacetValue extends VendureEntity implements Translatable, HasCustomFields, ChannelAware {
    constructor(input?: DeepPartial<FacetValue>);
    name: LocaleString;
    code: string;
    translations: Array<Translation<FacetValue>>;
    facet: Facet;
    facetId: ID;
    customFields: CustomFacetValueFields;
    channels: Channel[];
    products: Product[];
    productVariants: ProductVariant[];
}
