import { ID } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { Administrator } from '../../entity';
import { VendureEvent } from '../vendure-event';
/**
 * @description
 * This event is fired whenever one {@link Role} is assigned or removed from a user.
 * The property `roleIds` only contains the removed or assigned role ids.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export declare class RoleChangeEvent extends VendureEvent {
    ctx: RequestContext;
    admin: Administrator;
    roleIds: ID[];
    type: 'assigned' | 'removed';
    constructor(ctx: RequestContext, admin: Administrator, roleIds: ID[], type: 'assigned' | 'removed');
}
