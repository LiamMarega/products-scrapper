import { DeepPartial } from '@vendure/common/lib/shared-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomCustomerGroupFields } from '../custom-entity-fields';
import { Customer } from '../customer/customer.entity';
import { TaxRate } from '../tax-rate/tax-rate.entity';
/**
 * @description
 * A grouping of {@link Customer}s which enables features such as group-based promotions
 * or tax rules.
 *
 * @docsCategory entities
 */
export declare class CustomerGroup extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<CustomerGroup>);
    name: string;
    customers: Customer[];
    customFields: CustomCustomerGroupFields;
    taxRates: TaxRate[];
}
