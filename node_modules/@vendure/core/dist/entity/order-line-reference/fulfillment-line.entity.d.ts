import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Fulfillment } from '../fulfillment/fulfillment.entity';
import { OrderLineReference } from './order-line-reference.entity';
/**
 * @description
 * This entity represents a line from an {@link Order} which has been fulfilled by a {@link Fulfillment}.
 *
 * @docsCategory entities
 * @docsPage OrderLineReference
 */
export declare class FulfillmentLine extends OrderLineReference {
    constructor(input?: DeepPartial<FulfillmentLine>);
    fulfillment: Fulfillment;
    fulfillmentId: ID;
}
