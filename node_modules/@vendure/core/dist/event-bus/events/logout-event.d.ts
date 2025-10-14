import { RequestContext } from '../../api/common/request-context';
import { VendureEvent } from '../vendure-event';
/**
 * @description
 * This event is fired when a user logs out via the shop or admin API `logout` mutation.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export declare class LogoutEvent extends VendureEvent {
    ctx: RequestContext;
    constructor(ctx: RequestContext);
}
