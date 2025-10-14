import { RequestContext } from '../../api/common/request-context';
import { User } from '../../entity/user/user.entity';
import { VendureEvent } from '../vendure-event';
/**
 * @description
 * This event is fired when a registered user successfully changes the identifier (ie email address)
 * associated with their account.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export declare class IdentifierChangeEvent extends VendureEvent {
    ctx: RequestContext;
    user: User;
    oldIdentifier: string;
    constructor(ctx: RequestContext, user: User, oldIdentifier: string);
}
