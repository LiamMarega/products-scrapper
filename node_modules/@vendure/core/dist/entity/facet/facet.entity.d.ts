import { DeepPartial } from '@vendure/common/lib/shared-types';
import { ChannelAware } from '../../common/types/common-types';
import { LocaleString, Translatable, Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomFacetFields } from '../custom-entity-fields';
import { FacetValue } from '../facet-value/facet-value.entity';
/**
 * @description
 * A Facet is a class of properties which can be applied to a {@link Product} or {@link ProductVariant}.
 * They are used to enable [faceted search](https://en.wikipedia.org/wiki/Faceted_search) whereby products
 * can be filtered along a number of dimensions (facets).
 *
 * For example, there could be a Facet named "Brand" which has a number of {@link FacetValue}s representing
 * the various brands of product, e.g. "Apple", "Samsung", "Dell", "HP" etc.
 *
 * @docsCategory entities
 */
export declare class Facet extends VendureEntity implements Translatable, HasCustomFields, ChannelAware {
    constructor(input?: DeepPartial<Facet>);
    name: LocaleString;
    isPrivate: boolean;
    code: string;
    translations: Array<Translation<Facet>>;
    values: FacetValue[];
    customFields: CustomFacetFields;
    channels: Channel[];
}
