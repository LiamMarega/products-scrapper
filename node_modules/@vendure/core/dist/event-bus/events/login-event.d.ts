import { RequestContext } from '../../api/common/request-context';
import { User } from '../../entity/user/user.entity';
import { VendureEvent } from '../vendure-event';
/**
 * @description
 * This event is fired when a user successfully logs in via the shop or admin API `login` mutation.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export declare class LoginEvent extends VendureEvent {
    ctx: RequestContext;
    user: User;
    constructor(ctx: RequestContext, user: User);
}
