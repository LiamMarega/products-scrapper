import { DeepPartial } from '@vendure/common/lib/shared-types';
import { ChannelAware, SoftDeletable } from '../../common/types/common-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { Address } from '../address/address.entity';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomCustomerFields } from '../custom-entity-fields';
import { CustomerGroup } from '../customer-group/customer-group.entity';
import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';
/**
 * @description
 * This entity represents a customer of the store, typically an individual person. A Customer can be
 * a guest, in which case it has no associated {@link User}. Customers with registered account will
 * have an associated User entity.
 *
 * @docsCategory entities
 */
export declare class Customer extends VendureEntity implements ChannelAware, HasCustomFields, SoftDeletable {
    constructor(input?: DeepPartial<Customer>);
    deletedAt: Date | null;
    title: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    emailAddress: string;
    groups: CustomerGroup[];
    addresses: Address[];
    orders: Order[];
    user?: User;
    customFields: CustomCustomerFields;
    channels: Channel[];
}
