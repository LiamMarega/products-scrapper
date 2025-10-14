import { DeepPartial } from '@vendure/common/lib/shared-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomAddressFields } from '../custom-entity-fields';
import { Customer } from '../customer/customer.entity';
import { Country } from '../region/country.entity';
/**
 * @description
 * Represents a {@link Customer}'s address.
 *
 * @docsCategory entities
 */
export declare class Address extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<Address>);
    customer: Customer;
    fullName: string;
    company: string;
    streetLine1: string;
    streetLine2: string;
    city: string;
    province: string;
    postalCode: string;
    country: Country;
    phoneNumber: string;
    defaultShippingAddress: boolean;
    defaultBillingAddress: boolean;
    customFields: CustomAddressFields;
}
