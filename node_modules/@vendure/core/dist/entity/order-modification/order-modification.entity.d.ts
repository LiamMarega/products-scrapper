import { OrderAddress } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { VendureEntity } from '../base/base.entity';
import { OrderModificationLine } from '../order-line-reference/order-modification-line.entity';
import { Order } from '../order/order.entity';
import { Payment } from '../payment/payment.entity';
import { Refund } from '../refund/refund.entity';
import { Surcharge } from '../surcharge/surcharge.entity';
/**
 * @description
 * An entity which represents a modification to an order which has been placed, and
 * then modified afterwards by an administrator.
 *
 * @docsCategory entities
 */
export declare class OrderModification extends VendureEntity {
    constructor(input?: DeepPartial<OrderModification>);
    note: string;
    order: Order;
    lines: OrderModificationLine[];
    surcharges: Surcharge[];
    priceChange: number;
    payment?: Payment;
    refund?: Refund;
    shippingAddressChange: OrderAddress;
    billingAddressChange: OrderAddress;
    get isSettled(): boolean;
}
