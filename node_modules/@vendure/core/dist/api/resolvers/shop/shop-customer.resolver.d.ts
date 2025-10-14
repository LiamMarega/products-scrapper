import { MutationDeleteCustomerAddressArgs, MutationUpdateCustomerArgs, Success } from '@vendure/common/lib/generated-shop-types';
import { MutationCreateCustomerAddressArgs, MutationUpdateCustomerAddressArgs } from '@vendure/common/lib/generated-types';
import { Address, Customer } from '../../../entity';
import { CustomerService } from '../../../service/services/customer.service';
import { RequestContext } from '../../common/request-context';
export declare class ShopCustomerResolver {
    private customerService;
    constructor(customerService: CustomerService);
    activeCustomer(ctx: RequestContext): Promise<Customer | undefined>;
    updateCustomer(ctx: RequestContext, args: MutationUpdateCustomerArgs): Promise<Customer>;
    createCustomerAddress(ctx: RequestContext, args: MutationCreateCustomerAddressArgs): Promise<Address>;
    updateCustomerAddress(ctx: RequestContext, args: MutationUpdateCustomerAddressArgs): Promise<Address>;
    deleteCustomerAddress(ctx: RequestContext, args: MutationDeleteCustomerAddressArgs): Promise<Success>;
    /**
     * Returns the Customer entity associated with the current user.
     */
    private getCustomerForOwner;
}
