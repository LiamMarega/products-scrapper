import { ID } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { Asset } from '../../entity';
import { VendureEvent } from '../vendure-event';
/**
 * @description
 * This event is fired whenever an {@link Asset} is assigned or removed
 * From a channel.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export declare class AssetChannelEvent extends VendureEvent {
    ctx: RequestContext;
    asset: Asset;
    channelId: ID;
    type: 'assigned' | 'removed';
    constructor(ctx: RequestContext, asset: Asset, channelId: ID, type: 'assigned' | 'removed');
}
