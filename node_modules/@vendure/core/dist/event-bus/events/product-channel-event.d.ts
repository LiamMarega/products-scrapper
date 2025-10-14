import { ID } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { Product } from '../../entity';
import { VendureEvent } from '../vendure-event';
/**
 * @description
 * This event is fired whenever a {@link Product} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export declare class ProductChannelEvent extends VendureEvent {
    ctx: RequestContext;
    product: Product;
    channelId: ID;
    type: 'assigned' | 'removed';
    constructor(ctx: RequestContext, product: Product, channelId: ID, type: 'assigned' | 'removed');
}
