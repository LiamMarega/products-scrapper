import { Adjustment, AdjustmentType, Discount, TaxLine } from '@vendure/common/lib/generated-types';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { Asset } from '../asset/asset.entity';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomOrderLineFields } from '../custom-entity-fields';
import { Order } from '../order/order.entity';
import { OrderLineReference } from '../order-line-reference/order-line-reference.entity';
import { ProductVariant } from '../product-variant/product-variant.entity';
import { ShippingLine } from '../shipping-line/shipping-line.entity';
import { Allocation } from '../stock-movement/allocation.entity';
import { Cancellation } from '../stock-movement/cancellation.entity';
import { Sale } from '../stock-movement/sale.entity';
import { TaxCategory } from '../tax-category/tax-category.entity';
/**
 * @description
 * A single line on an {@link Order} which contains information about the {@link ProductVariant} and
 * quantity ordered, as well as the price and tax information.
 *
 * @docsCategory entities
 */
export declare class OrderLine extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<OrderLine>);
    /**
     * @description
     * The {@link Channel} of the {@link Seller} for a multivendor setup.
     */
    sellerChannel?: Channel;
    sellerChannelId?: ID;
    /**
     * @description
     * The {@link ShippingLine} to which this line has been assigned.
     * This is determined by the configured {@link ShippingLineAssignmentStrategy}.
     */
    shippingLine?: ShippingLine;
    shippingLineId?: ID;
    /**
     * @description
     * The {@link ProductVariant} which is being ordered.
     */
    productVariant: ProductVariant;
    productVariantId: ID;
    taxCategory: TaxCategory;
    taxCategoryId: ID;
    featuredAsset: Asset;
    order: Order;
    linesReferences: OrderLineReference[];
    sales: Sale[];
    quantity: number;
    /**
     * @description
     * The quantity of this OrderLine at the time the order was placed (as per the {@link OrderPlacedStrategy}).
     */
    orderPlacedQuantity: number;
    /**
     * @description
     * The price as calculated when the OrderLine was first added to the Order. Usually will be identical to the
     * `listPrice`, except when the ProductVariant price has changed in the meantime and a re-calculation of
     * the Order has been performed.
     */
    initialListPrice: number;
    /**
     * @description
     * This is the price as listed by the ProductVariant (and possibly modified by the {@link OrderItemPriceCalculationStrategy}),
     * which, depending on the current Channel, may or may not include tax.
     */
    listPrice: number;
    /**
     * @description
     * Whether the listPrice includes tax, which depends on the settings of the current Channel.
     */
    listPriceIncludesTax: boolean;
    adjustments: Adjustment[];
    taxLines: TaxLine[];
    cancellations: Cancellation[];
    allocations: Allocation[];
    customFields: CustomOrderLineFields;
    /**
     * @description
     * The price of a single unit, excluding tax and discounts.
     */
    get unitPrice(): number;
    /**
     * @description
     * The price of a single unit, including tax but excluding discounts.
     */
    get unitPriceWithTax(): number;
    /**
     * @description
     * Non-zero if the `unitPrice` has changed since it was initially added to Order.
     */
    get unitPriceChangeSinceAdded(): number;
    /**
     * @description
     * Non-zero if the `unitPriceWithTax` has changed since it was initially added to Order.
     */
    get unitPriceWithTaxChangeSinceAdded(): number;
    /**
     * @description
     * The price of a single unit including discounts, excluding tax.
     *
     * If Order-level discounts have been applied, this will not be the
     * actual taxable unit price (see `proratedUnitPrice`), but is generally the
     * correct price to display to customers to avoid confusion
     * about the internal handling of distributed Order-level discounts.
     */
    get discountedUnitPrice(): number;
    /**
     * @description
     * The price of a single unit including discounts and tax
     */
    get discountedUnitPriceWithTax(): number;
    /**
     * @description
     * The actual unit price, taking into account both item discounts _and_ prorated (proportionally-distributed)
     * Order-level discounts. This value is the true economic value of a single unit in this OrderLine, and is used in tax
     * and refund calculations.
     */
    get proratedUnitPrice(): number;
    /**
     * @description
     * The `proratedUnitPrice` including tax.
     */
    get proratedUnitPriceWithTax(): number;
    get unitTax(): number;
    get proratedUnitTax(): number;
    get taxRate(): number;
    /**
     * @description
     * The total price of the line excluding tax and discounts.
     */
    get linePrice(): number;
    /**
     * @description
     * The total price of the line including tax but excluding discounts.
     */
    get linePriceWithTax(): number;
    /**
     * @description
     * The price of the line including discounts, excluding tax.
     */
    get discountedLinePrice(): number;
    /**
     * @description
     * The price of the line including discounts and tax.
     */
    get discountedLinePriceWithTax(): number;
    get discounts(): Discount[];
    /**
     * @description
     * The total tax on this line.
     */
    get lineTax(): number;
    /**
     * @description
     * The actual line price, taking into account both item discounts _and_ prorated (proportionally-distributed)
     * Order-level discounts. This value is the true economic value of the OrderLine, and is used in tax
     * and refund calculations.
     */
    get proratedLinePrice(): number;
    /**
     * @description
     * The `proratedLinePrice` including tax.
     */
    get proratedLinePriceWithTax(): number;
    get proratedLineTax(): number;
    addAdjustment(adjustment: Adjustment): void;
    /**
     * Clears Adjustments from all OrderItems of the given type. If no type
     * is specified, then all adjustments are removed.
     */
    clearAdjustments(type?: AdjustmentType): void;
    private _unitPrice;
    private _unitPriceWithTax;
    private _discountedUnitPrice;
    private _discountedUnitPriceWithTax;
    /**
     * @description
     * Calculates the prorated unit price, excluding tax. This function performs no
     * rounding, so before being exposed publicly via the GraphQL API, the returned value
     * needs to be rounded to ensure it is an integer.
     */
    private _proratedUnitPrice;
    /**
     * @description
     * Calculates the prorated unit price, including tax. This function performs no
     * rounding, so before being exposed publicly via the GraphQL API, the returned value
     * needs to be rounded to ensure it is an integer.
     */
    private _proratedUnitPriceWithTax;
    /**
     * @description
     * The total of all price adjustments. Will typically be a negative number due to discounts.
     */
    private getUnitAdjustmentsTotal;
    /**
     * @description
     * The total of all price adjustments. Will typically be a negative number due to discounts.
     */
    private getLineAdjustmentsTotal;
}
