import { Adjustment, Discount, TaxLine } from '@vendure/common/lib/generated-types';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { CustomShippingLineFields } from '../custom-entity-fields';
import { Order } from '../order/order.entity';
import { OrderLine } from '../order-line/order-line.entity';
import { ShippingMethod } from '../shipping-method/shipping-method.entity';
/**
 * @description
 * A ShippingLine is created when a {@link ShippingMethod} is applied to an {@link Order}.
 * It contains information about the price of the shipping method, any discounts that were
 * applied, and the resulting tax on the shipping method.
 *
 * @docsCategory entities
 */
export declare class ShippingLine extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<ShippingLine>);
    shippingMethodId: ID | null;
    shippingMethod: ShippingMethod;
    order: Order;
    listPrice: number;
    listPriceIncludesTax: boolean;
    adjustments: Adjustment[];
    taxLines: TaxLine[];
    orderLines: OrderLine[];
    customFields: CustomShippingLineFields;
    get price(): number;
    get priceWithTax(): number;
    get discountedPrice(): number;
    get discountedPriceWithTax(): number;
    get taxRate(): number;
    get discounts(): Discount[];
    addAdjustment(adjustment: Adjustment): void;
    clearAdjustments(): void;
    /**
     * @description
     * The total of all price adjustments. Will typically be a negative number due to discounts.
     */
    private getAdjustmentsTotal;
}
