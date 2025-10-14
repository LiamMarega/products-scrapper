import { CreateCustomerResult, DeletionResponse, MutationAddNoteToCustomerArgs, MutationCreateCustomerAddressArgs, MutationCreateCustomerArgs, MutationDeleteCustomerAddressArgs, MutationDeleteCustomerArgs, MutationDeleteCustomerNoteArgs, MutationDeleteCustomersArgs, MutationUpdateCustomerAddressArgs, MutationUpdateCustomerArgs, MutationUpdateCustomerNoteArgs, QueryCustomerArgs, QueryCustomersArgs, Success, UpdateCustomerResult } from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';
import { ErrorResultUnion } from '../../../common/error/error-result';
import { Address } from '../../../entity/address/address.entity';
import { Customer } from '../../../entity/customer/customer.entity';
import { CustomerGroupService } from '../../../service/services/customer-group.service';
import { CustomerService } from '../../../service/services/customer.service';
import { OrderService } from '../../../service/services/order.service';
import { RequestContext } from '../../common/request-context';
import { RelationPaths } from '../../decorators/relations.decorator';
export declare class CustomerResolver {
    private customerService;
    private customerGroupService;
    private orderService;
    constructor(customerService: CustomerService, customerGroupService: CustomerGroupService, orderService: OrderService);
    customers(ctx: RequestContext, args: QueryCustomersArgs, relations: RelationPaths<Customer>): Promise<PaginatedList<Customer>>;
    customer(ctx: RequestContext, args: QueryCustomerArgs, relations: RelationPaths<Customer>): Promise<Customer | undefined>;
    createCustomer(ctx: RequestContext, args: MutationCreateCustomerArgs): Promise<ErrorResultUnion<CreateCustomerResult, Customer>>;
    updateCustomer(ctx: RequestContext, args: MutationUpdateCustomerArgs): Promise<ErrorResultUnion<UpdateCustomerResult, Customer>>;
    createCustomerAddress(ctx: RequestContext, args: MutationCreateCustomerAddressArgs): Promise<Address>;
    updateCustomerAddress(ctx: RequestContext, args: MutationUpdateCustomerAddressArgs): Promise<Address>;
    deleteCustomerAddress(ctx: RequestContext, args: MutationDeleteCustomerAddressArgs): Promise<Success>;
    deleteCustomer(ctx: RequestContext, args: MutationDeleteCustomerArgs): Promise<DeletionResponse>;
    deleteCustomers(ctx: RequestContext, args: MutationDeleteCustomersArgs): Promise<DeletionResponse[]>;
    addNoteToCustomer(ctx: RequestContext, args: MutationAddNoteToCustomerArgs): Promise<Customer>;
    updateCustomerNote(ctx: RequestContext, args: MutationUpdateCustomerNoteArgs): Promise<import("../../../entity/history-entry/history-entry.entity").HistoryEntry>;
    deleteCustomerNote(ctx: RequestContext, args: MutationDeleteCustomerNoteArgs): Promise<DeletionResponse>;
}
