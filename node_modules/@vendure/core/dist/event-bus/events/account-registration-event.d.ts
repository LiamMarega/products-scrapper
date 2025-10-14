import { RequestContext } from '../../api/common/request-context';
import { User } from '../../entity/user/user.entity';
import { VendureEvent } from '../vendure-event';
/**
 * @description
 * This event is fired when a new user registers an account, either as a stand-alone signup or after
 * placing an order.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export declare class AccountRegistrationEvent extends VendureEvent {
    ctx: RequestContext;
    user: User;
    constructor(ctx: RequestContext, user: User);
}
