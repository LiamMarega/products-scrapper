import { RequestContext } from '../../api/common/request-context';
import { User } from '../../entity/user/user.entity';
import { VendureEvent } from '../vendure-event';
/**
 * @description
 * This event is fired when a Customer requests a password reset email.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export declare class PasswordResetEvent extends VendureEvent {
    ctx: RequestContext;
    user: User;
    constructor(ctx: RequestContext, user: User);
}
