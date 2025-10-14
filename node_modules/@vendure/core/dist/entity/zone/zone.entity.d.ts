import { DeepPartial } from '@vendure/common/lib/shared-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomZoneFields } from '../custom-entity-fields';
import { Region } from '../region/region.entity';
import { TaxRate } from '../tax-rate/tax-rate.entity';
/**
 * @description
 * A Zone is a grouping of one or more {@link Country} entities. It is used for
 * calculating applicable shipping and taxes.
 *
 * @docsCategory entities
 */
export declare class Zone extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<Zone>);
    name: string;
    members: Region[];
    customFields: CustomZoneFields;
    defaultShippingZoneChannels: Channel[];
    defaultTaxZoneChannels: Channel[];
    taxRates: TaxRate[];
}
