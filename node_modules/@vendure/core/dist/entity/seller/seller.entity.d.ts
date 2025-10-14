import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Channel } from '..';
import { SoftDeletable } from '../../common/types/common-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomSellerFields } from '../custom-entity-fields';
/**
 * @description
 * A Seller represents the person or organization who is selling the goods on a given {@link Channel}.
 * By default, a single-channel Vendure installation will have a single default Seller.
 *
 * @docsCategory entities
 */
export declare class Seller extends VendureEntity implements SoftDeletable, HasCustomFields {
    constructor(input?: DeepPartial<Seller>);
    deletedAt: Date | null;
    name: string;
    customFields: CustomSellerFields;
    channels: Channel[];
}
