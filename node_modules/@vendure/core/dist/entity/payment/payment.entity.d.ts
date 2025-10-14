import { DeepPartial } from '@vendure/common/lib/shared-types';
import { PaymentMetadata } from '../../common/types/common-types';
import { HasCustomFields } from '../../config/index';
import { PaymentState } from '../../service/helpers/payment-state-machine/payment-state';
import { VendureEntity } from '../base/base.entity';
import { CustomPaymentFields } from '../custom-entity-fields';
import { Order } from '../order/order.entity';
import { Refund } from '../refund/refund.entity';
/**
 * @description
 * A Payment represents a single payment transaction and exists in a well-defined state
 * defined by the {@link PaymentState} type.
 *
 * @docsCategory entities
 */
export declare class Payment extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<Payment>);
    method: string;
    amount: number;
    state: PaymentState;
    errorMessage: string | undefined;
    transactionId: string;
    metadata: PaymentMetadata;
    order: Order;
    refunds: Refund[];
    customFields: CustomPaymentFields;
}
