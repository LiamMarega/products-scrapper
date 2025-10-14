import { RequestContext } from '../../api/common/request-context';
import { Customer } from '../../entity/customer/customer.entity';
import { CustomerGroup } from '../../entity/customer-group/customer-group.entity';
import { VendureEvent } from '../vendure-event';
/**
 * @description
 * This event is fired whenever one or more {@link Customer} is assigned to or removed from a
 * {@link CustomerGroup}.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export declare class CustomerGroupChangeEvent extends VendureEvent {
    ctx: RequestContext;
    customers: Customer[];
    customGroup: CustomerGroup;
    type: 'assigned' | 'removed';
    constructor(ctx: RequestContext, customers: Customer[], customGroup: CustomerGroup, type: 'assigned' | 'removed');
}
