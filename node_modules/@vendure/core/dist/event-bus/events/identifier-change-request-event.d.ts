import { RequestContext } from '../../api/common/request-context';
import { User } from '../../entity/user/user.entity';
import { VendureEvent } from '../vendure-event';
/**
 * @description
 * This event is fired when a registered user requests to update the identifier (ie email address)
 * associated with the account.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export declare class IdentifierChangeRequestEvent extends VendureEvent {
    ctx: RequestContext;
    user: User;
    constructor(ctx: RequestContext, user: User);
}
