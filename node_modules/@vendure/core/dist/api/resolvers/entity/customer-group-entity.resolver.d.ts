import { QueryCustomersArgs } from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';
import { Customer } from '../../../entity/customer/customer.entity';
import { CustomerGroup } from '../../../entity/customer-group/customer-group.entity';
import { CustomerGroupService } from '../../../service/services/customer-group.service';
import { RequestContext } from '../../common/request-context';
export declare class CustomerGroupEntityResolver {
    private customerGroupService;
    constructor(customerGroupService: CustomerGroupService);
    customers(ctx: RequestContext, customerGroup: CustomerGroup, args: QueryCustomersArgs): Promise<PaginatedList<Customer>>;
}
