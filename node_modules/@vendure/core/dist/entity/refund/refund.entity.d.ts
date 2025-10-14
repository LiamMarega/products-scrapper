import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { PaymentMetadata } from '../../common/types/common-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { RefundState } from '../../service/helpers/refund-state-machine/refund-state';
import { VendureEntity } from '../base/base.entity';
import { CustomRefundFields } from '../custom-entity-fields';
import { RefundLine } from '../order-line-reference/refund-line.entity';
import { Payment } from '../payment/payment.entity';
/**
 * @description A refund the belongs to an order
 *
 * @docsCategory entities
 */
export declare class Refund extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<Refund>);
    /**
     * @deprecated Since v2.2, the `items` field will not be used by default. Instead, the `total` field
     * alone will be used to determine the refund amount.
     */
    items: number;
    /**
     * @deprecated Since v2.2, the `shipping` field will not be used by default. Instead, the `total` field
     * alone will be used to determine the refund amount.
     */
    shipping: number;
    /**
     * @deprecated Since v2.2, the `adjustment` field will not be used by default. Instead, the `total` field
     * alone will be used to determine the refund amount.
     */
    adjustment: number;
    total: number;
    method: string;
    reason: string;
    state: RefundState;
    transactionId: string;
    lines: RefundLine[];
    payment: Payment;
    paymentId: ID;
    metadata: PaymentMetadata;
    customFields: CustomRefundFields;
}
