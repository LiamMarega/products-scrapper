import { RequestContext } from '../../api/common/request-context';
import { User } from '../../entity/user/user.entity';
import { VendureEvent } from '../vendure-event';
/**
 * @description
 * This event is fired when a password reset is executed with a verified token.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export declare class PasswordResetVerifiedEvent extends VendureEvent {
    ctx: RequestContext;
    user: User;
    constructor(ctx: RequestContext, user: User);
}
