import { DeletionResponse, MutationAddCustomersToGroupArgs, MutationCreateCustomerGroupArgs, MutationDeleteCustomerGroupArgs, MutationRemoveCustomersFromGroupArgs, MutationUpdateCustomerGroupArgs, MutationDeleteCustomerGroupsArgs, QueryCustomerGroupArgs, QueryCustomerGroupsArgs } from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';
import { CustomerGroup } from '../../../entity/customer-group/customer-group.entity';
import { CustomerGroupService } from '../../../service/services/customer-group.service';
import { RequestContext } from '../../common/request-context';
import { RelationPaths } from '../../decorators/relations.decorator';
export declare class CustomerGroupResolver {
    private customerGroupService;
    constructor(customerGroupService: CustomerGroupService);
    customerGroups(ctx: RequestContext, args: QueryCustomerGroupsArgs, relations: RelationPaths<CustomerGroup>): Promise<PaginatedList<CustomerGroup>>;
    customerGroup(ctx: RequestContext, args: QueryCustomerGroupArgs, relations: RelationPaths<CustomerGroup>): Promise<CustomerGroup | undefined>;
    createCustomerGroup(ctx: RequestContext, args: MutationCreateCustomerGroupArgs): Promise<CustomerGroup>;
    updateCustomerGroup(ctx: RequestContext, args: MutationUpdateCustomerGroupArgs): Promise<CustomerGroup>;
    deleteCustomerGroup(ctx: RequestContext, args: MutationDeleteCustomerGroupArgs): Promise<DeletionResponse>;
    deleteCustomerGroups(ctx: RequestContext, args: MutationDeleteCustomerGroupsArgs): Promise<DeletionResponse[]>;
    addCustomersToGroup(ctx: RequestContext, args: MutationAddCustomersToGroupArgs): Promise<CustomerGroup>;
    removeCustomersFromGroup(ctx: RequestContext, args: MutationRemoveCustomersFromGroupArgs): Promise<CustomerGroup>;
}
