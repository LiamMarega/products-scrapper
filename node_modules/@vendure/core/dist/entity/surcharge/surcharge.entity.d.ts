import { TaxLine } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { VendureEntity } from '../base/base.entity';
import { Order } from '../order/order.entity';
import { OrderModification } from '../order-modification/order-modification.entity';
/**
 * @description
 * A Surcharge represents an arbitrary extra item on an {@link Order} which is not
 * a ProductVariant. It can be used to e.g. represent payment-related surcharges.
 *
 * @docsCategory entities
 */
export declare class Surcharge extends VendureEntity {
    constructor(input?: DeepPartial<Surcharge>);
    description: string;
    listPrice: number;
    listPriceIncludesTax: boolean;
    sku: string;
    taxLines: TaxLine[];
    order: Order;
    orderModification: OrderModification;
    get price(): number;
    get priceWithTax(): number;
    get taxRate(): number;
}
