import { DeepPartial } from '@vendure/common/lib/shared-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { FulfillmentState } from '../../service/helpers/fulfillment-state-machine/fulfillment-state';
import { VendureEntity } from '../base/base.entity';
import { CustomFulfillmentFields } from '../custom-entity-fields';
import { Order } from '../order/order.entity';
import { FulfillmentLine } from '../order-line-reference/fulfillment-line.entity';
/**
 * @description
 * This entity represents a fulfillment of an Order or part of it, i.e. which {@link OrderLine}s have been
 * delivered to the Customer after successful payment.
 *
 * @docsCategory entities
 */
export declare class Fulfillment extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<Fulfillment>);
    state: FulfillmentState;
    trackingCode: string;
    method: string;
    handlerCode: string;
    lines: FulfillmentLine[];
    orders: Order[];
    customFields: CustomFulfillmentFields;
}
