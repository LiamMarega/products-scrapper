import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Refund } from '../refund/refund.entity';
import { OrderLineReference } from './order-line-reference.entity';
/**
 * @description
 * This entity represents a line from an {@link Order} which has been refunded by a {@link Refund}.
 *
 * @docsCategory entities
 * @docsPage OrderLineReference
 */
export declare class RefundLine extends OrderLineReference {
    constructor(input?: DeepPartial<RefundLine>);
    refund: Refund;
    refundId: ID;
}
