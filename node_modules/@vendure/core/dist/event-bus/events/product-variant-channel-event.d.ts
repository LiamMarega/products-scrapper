import { ID } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { ProductVariant } from '../../entity';
import { VendureEvent } from '../vendure-event';
/**
 * @description
 * This event is fired whenever a {@link ProductVariant} is assigned or removed from a {@link Channel}.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export declare class ProductVariantChannelEvent extends VendureEvent {
    ctx: RequestContext;
    productVariant: ProductVariant;
    channelId: ID;
    type: 'assigned' | 'removed';
    constructor(ctx: RequestContext, productVariant: ProductVariant, channelId: ID, type: 'assigned' | 'removed');
}
