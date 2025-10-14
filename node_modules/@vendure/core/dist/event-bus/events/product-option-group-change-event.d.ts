import { ID } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { Product } from '../../entity';
import { VendureEvent } from '../vendure-event';
/**
 * @description
 * This event is fired whenever a {@link ProductOptionGroup} is assigned or removed from a {@link Product}.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export declare class ProductOptionGroupChangeEvent extends VendureEvent {
    ctx: RequestContext;
    product: Product;
    optionGroupId: ID;
    type: 'assigned' | 'removed';
    constructor(ctx: RequestContext, product: Product, optionGroupId: ID, type: 'assigned' | 'removed');
}
