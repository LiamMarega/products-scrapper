import { QueryOrdersArgs } from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';
import { Address } from '../../../entity/address/address.entity';
import { Customer } from '../../../entity/customer/customer.entity';
import { Order } from '../../../entity/order/order.entity';
import { CustomerService } from '../../../service/services/customer.service';
import { HistoryService } from '../../../service/services/history.service';
import { OrderService } from '../../../service/services/order.service';
import { UserService } from '../../../service/services/user.service';
import { ApiType } from '../../common/get-api-type';
import { RequestContext } from '../../common/request-context';
import { RelationPaths } from '../../decorators/relations.decorator';
export declare class CustomerEntityResolver {
    private customerService;
    private orderService;
    private userService;
    constructor(customerService: CustomerService, orderService: OrderService, userService: UserService);
    addresses(ctx: RequestContext, customer: Customer, apiType: ApiType): Promise<Address[]>;
    orders(ctx: RequestContext, customer: Customer, args: QueryOrdersArgs, apiType: ApiType, relations: RelationPaths<Order>): Promise<PaginatedList<Order>>;
    user(ctx: RequestContext, customer: Customer): import("../../..").User | Promise<import("../../..").User | undefined>;
}
export declare class CustomerAdminEntityResolver {
    private customerService;
    private historyService;
    constructor(customerService: CustomerService, historyService: HistoryService);
    groups(ctx: RequestContext, customer: Customer): import("../../..").CustomerGroup[] | Promise<import("../../..").CustomerGroup[]>;
    history(ctx: RequestContext, apiType: ApiType, order: Order, args: any): Promise<PaginatedList<import("../../../entity/history-entry/customer-history-entry.entity").CustomerHistoryEntry>>;
}
