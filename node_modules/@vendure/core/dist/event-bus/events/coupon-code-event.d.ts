import { ID } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { VendureEvent } from '../vendure-event';
/**
 * @description
 * This event is fired whenever an coupon code of an active {@link Promotion}
 * is assigned or removed to an {@link Order}.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export declare class CouponCodeEvent extends VendureEvent {
    ctx: RequestContext;
    couponCode: string;
    orderId: ID;
    type: 'assigned' | 'removed';
    constructor(ctx: RequestContext, couponCode: string, orderId: ID, type: 'assigned' | 'removed');
}
