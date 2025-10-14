"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderLine = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const shared_utils_1 = require("@vendure/common/lib/shared-utils");
const typeorm_1 = require("typeorm");
const calculated_decorator_1 = require("../../common/calculated-decorator");
const round_money_1 = require("../../common/round-money");
const tax_utils_1 = require("../../common/tax-utils");
const asset_entity_1 = require("../asset/asset.entity");
const base_entity_1 = require("../base/base.entity");
const channel_entity_1 = require("../channel/channel.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const entity_id_decorator_1 = require("../entity-id.decorator");
const money_decorator_1 = require("../money.decorator");
const order_entity_1 = require("../order/order.entity");
const order_line_reference_entity_1 = require("../order-line-reference/order-line-reference.entity");
const product_variant_entity_1 = require("../product-variant/product-variant.entity");
const shipping_line_entity_1 = require("../shipping-line/shipping-line.entity");
const allocation_entity_1 = require("../stock-movement/allocation.entity");
const cancellation_entity_1 = require("../stock-movement/cancellation.entity");
const sale_entity_1 = require("../stock-movement/sale.entity");
const tax_category_entity_1 = require("../tax-category/tax-category.entity");
/**
 * @description
 * A single line on an {@link Order} which contains information about the {@link ProductVariant} and
 * quantity ordered, as well as the price and tax information.
 *
 * @docsCategory entities
 */
let OrderLine = class OrderLine extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
    /**
     * @description
     * The price of a single unit, excluding tax and discounts.
     */
    get unitPrice() {
        return (0, round_money_1.roundMoney)(this._unitPrice());
    }
    /**
     * @description
     * The price of a single unit, including tax but excluding discounts.
     */
    get unitPriceWithTax() {
        return (0, round_money_1.roundMoney)(this._unitPriceWithTax());
    }
    /**
     * @description
     * Non-zero if the `unitPrice` has changed since it was initially added to Order.
     */
    get unitPriceChangeSinceAdded() {
        const { initialListPrice, listPriceIncludesTax } = this;
        const initialPrice = listPriceIncludesTax
            ? (0, tax_utils_1.netPriceOf)(initialListPrice, this.taxRate)
            : initialListPrice;
        return (0, round_money_1.roundMoney)(this._unitPrice() - initialPrice);
    }
    /**
     * @description
     * Non-zero if the `unitPriceWithTax` has changed since it was initially added to Order.
     */
    get unitPriceWithTaxChangeSinceAdded() {
        const { initialListPrice, listPriceIncludesTax } = this;
        const initialPriceWithTax = listPriceIncludesTax
            ? initialListPrice
            : (0, tax_utils_1.grossPriceOf)(initialListPrice, this.taxRate);
        return (0, round_money_1.roundMoney)(this._unitPriceWithTax() - initialPriceWithTax);
    }
    /**
     * @description
     * The price of a single unit including discounts, excluding tax.
     *
     * If Order-level discounts have been applied, this will not be the
     * actual taxable unit price (see `proratedUnitPrice`), but is generally the
     * correct price to display to customers to avoid confusion
     * about the internal handling of distributed Order-level discounts.
     */
    get discountedUnitPrice() {
        return (0, round_money_1.roundMoney)(this._discountedUnitPrice());
    }
    /**
     * @description
     * The price of a single unit including discounts and tax
     */
    get discountedUnitPriceWithTax() {
        return (0, round_money_1.roundMoney)(this._discountedUnitPriceWithTax());
    }
    /**
     * @description
     * The actual unit price, taking into account both item discounts _and_ prorated (proportionally-distributed)
     * Order-level discounts. This value is the true economic value of a single unit in this OrderLine, and is used in tax
     * and refund calculations.
     */
    get proratedUnitPrice() {
        return (0, round_money_1.roundMoney)(this._proratedUnitPrice());
    }
    /**
     * @description
     * The `proratedUnitPrice` including tax.
     */
    get proratedUnitPriceWithTax() {
        return (0, round_money_1.roundMoney)(this._proratedUnitPriceWithTax());
    }
    get unitTax() {
        return this.unitPriceWithTax - this.unitPrice;
    }
    get proratedUnitTax() {
        return this.proratedUnitPriceWithTax - this.proratedUnitPrice;
    }
    get taxRate() {
        return (0, shared_utils_1.summate)(this.taxLines, 'taxRate');
    }
    /**
     * @description
     * The total price of the line excluding tax and discounts.
     */
    get linePrice() {
        return (0, round_money_1.roundMoney)(this._unitPrice(), this.quantity);
    }
    /**
     * @description
     * The total price of the line including tax but excluding discounts.
     */
    get linePriceWithTax() {
        return (0, round_money_1.roundMoney)(this._unitPriceWithTax(), this.quantity);
    }
    /**
     * @description
     * The price of the line including discounts, excluding tax.
     */
    get discountedLinePrice() {
        // return roundMoney(this.linePrice + this.getLineAdjustmentsTotal(false, AdjustmentType.PROMOTION));
        return (0, round_money_1.roundMoney)(this._discountedUnitPrice(), this.quantity);
    }
    /**
     * @description
     * The price of the line including discounts and tax.
     */
    get discountedLinePriceWithTax() {
        return (0, round_money_1.roundMoney)(this._discountedUnitPriceWithTax(), this.quantity);
    }
    get discounts() {
        const priceIncludesTax = this.listPriceIncludesTax;
        // Group discounts together, so that it does not list a new
        // discount row for each item in the line
        const groupedDiscounts = new Map();
        for (const adjustment of this.adjustments) {
            const discountGroup = groupedDiscounts.get(adjustment.adjustmentSource);
            const unitAdjustmentAmount = (adjustment.amount / Math.max(this.orderPlacedQuantity, this.quantity)) * this.quantity;
            const amount = priceIncludesTax
                ? (0, tax_utils_1.netPriceOf)(unitAdjustmentAmount, this.taxRate)
                : unitAdjustmentAmount;
            const amountWithTax = priceIncludesTax
                ? unitAdjustmentAmount
                : (0, tax_utils_1.grossPriceOf)(unitAdjustmentAmount, this.taxRate);
            if (discountGroup) {
                discountGroup.amount += amount;
                discountGroup.amountWithTax += amountWithTax;
            }
            else {
                groupedDiscounts.set(adjustment.adjustmentSource, Object.assign(Object.assign({}, adjustment), { amount: (0, round_money_1.roundMoney)(amount), amountWithTax: (0, round_money_1.roundMoney)(amountWithTax) }));
            }
        }
        return [...groupedDiscounts.values()];
    }
    /**
     * @description
     * The total tax on this line.
     */
    get lineTax() {
        return this.linePriceWithTax - this.linePrice;
    }
    /**
     * @description
     * The actual line price, taking into account both item discounts _and_ prorated (proportionally-distributed)
     * Order-level discounts. This value is the true economic value of the OrderLine, and is used in tax
     * and refund calculations.
     */
    get proratedLinePrice() {
        // return roundMoney(this.linePrice + this.getLineAdjustmentsTotal(false));
        return (0, round_money_1.roundMoney)(this._proratedUnitPrice(), this.quantity);
    }
    /**
     * @description
     * The `proratedLinePrice` including tax.
     */
    get proratedLinePriceWithTax() {
        // return roundMoney(this.linePriceWithTax + this.getLineAdjustmentsTotal(true));
        return (0, round_money_1.roundMoney)(this._proratedUnitPriceWithTax(), this.quantity);
    }
    get proratedLineTax() {
        return this.proratedLinePriceWithTax - this.proratedLinePrice;
    }
    addAdjustment(adjustment) {
        // We should not allow adding adjustments which would
        // result in a negative unit price
        const maxDiscount = (this.listPriceIncludesTax ? this.proratedLinePriceWithTax : this.proratedLinePrice) * -1;
        const limitedAdjustment = Object.assign(Object.assign({}, adjustment), { amount: Math.max(maxDiscount, adjustment.amount) });
        if (limitedAdjustment.amount !== 0) {
            this.adjustments = this.adjustments.concat(limitedAdjustment);
        }
    }
    /**
     * Clears Adjustments from all OrderItems of the given type. If no type
     * is specified, then all adjustments are removed.
     */
    clearAdjustments(type) {
        if (!type) {
            this.adjustments = [];
        }
        else {
            this.adjustments = this.adjustments ? this.adjustments.filter(a => a.type !== type) : [];
        }
    }
    _unitPrice() {
        return this.listPriceIncludesTax ? (0, tax_utils_1.netPriceOf)(this.listPrice, this.taxRate) : this.listPrice;
    }
    _unitPriceWithTax() {
        return this.listPriceIncludesTax ? this.listPrice : (0, tax_utils_1.grossPriceOf)(this.listPrice, this.taxRate);
    }
    _discountedUnitPrice() {
        const result = this.listPrice + this.getUnitAdjustmentsTotal(generated_types_1.AdjustmentType.PROMOTION);
        return this.listPriceIncludesTax ? (0, tax_utils_1.netPriceOf)(result, this.taxRate) : result;
    }
    _discountedUnitPriceWithTax() {
        const result = this.listPrice + this.getUnitAdjustmentsTotal(generated_types_1.AdjustmentType.PROMOTION);
        return this.listPriceIncludesTax ? result : (0, tax_utils_1.grossPriceOf)(result, this.taxRate);
    }
    /**
     * @description
     * Calculates the prorated unit price, excluding tax. This function performs no
     * rounding, so before being exposed publicly via the GraphQL API, the returned value
     * needs to be rounded to ensure it is an integer.
     */
    _proratedUnitPrice() {
        const result = this.listPrice + this.getUnitAdjustmentsTotal();
        return this.listPriceIncludesTax ? (0, tax_utils_1.netPriceOf)(result, this.taxRate) : result;
    }
    /**
     * @description
     * Calculates the prorated unit price, including tax. This function performs no
     * rounding, so before being exposed publicly via the GraphQL API, the returned value
     * needs to be rounded to ensure it is an integer.
     */
    _proratedUnitPriceWithTax() {
        const result = this.listPrice + this.getUnitAdjustmentsTotal();
        return this.listPriceIncludesTax ? result : (0, tax_utils_1.grossPriceOf)(result, this.taxRate);
    }
    /**
     * @description
     * The total of all price adjustments. Will typically be a negative number due to discounts.
     */
    getUnitAdjustmentsTotal(type) {
        if (!this.adjustments || this.quantity === 0) {
            return 0;
        }
        return this.adjustments
            .filter(adjustment => (type ? adjustment.type === type : true))
            .map(adjustment => adjustment.amount / Math.max(this.orderPlacedQuantity, this.quantity))
            .reduce((total, a) => total + a, 0);
    }
    /**
     * @description
     * The total of all price adjustments. Will typically be a negative number due to discounts.
     */
    getLineAdjustmentsTotal(withTax, type) {
        if (!this.adjustments || this.quantity === 0) {
            return 0;
        }
        const sum = this.adjustments
            .filter(adjustment => (type ? adjustment.type === type : true))
            .map(adjustment => adjustment.amount)
            .reduce((total, a) => total + a, 0);
        const adjustedForQuantityChanges = sum * (this.quantity / Math.max(this.orderPlacedQuantity, this.quantity));
        if (withTax) {
            return this.listPriceIncludesTax
                ? adjustedForQuantityChanges
                : (0, tax_utils_1.grossPriceOf)(adjustedForQuantityChanges, this.taxRate);
        }
        else {
            return this.listPriceIncludesTax
                ? (0, tax_utils_1.netPriceOf)(adjustedForQuantityChanges, this.taxRate)
                : adjustedForQuantityChanges;
        }
    }
};
exports.OrderLine = OrderLine;
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => channel_entity_1.Channel, { nullable: true, onDelete: 'SET NULL' }),
    __metadata("design:type", channel_entity_1.Channel)
], OrderLine.prototype, "sellerChannel", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)({ nullable: true }),
    __metadata("design:type", Object)
], OrderLine.prototype, "sellerChannelId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => shipping_line_entity_1.ShippingLine, shippingLine => shippingLine.orderLines, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    __metadata("design:type", shipping_line_entity_1.ShippingLine)
], OrderLine.prototype, "shippingLine", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)({ nullable: true }),
    __metadata("design:type", Object)
], OrderLine.prototype, "shippingLineId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => product_variant_entity_1.ProductVariant, productVariant => productVariant.lines, { onDelete: 'CASCADE' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], OrderLine.prototype, "productVariant", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)(),
    __metadata("design:type", Object)
], OrderLine.prototype, "productVariantId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => tax_category_entity_1.TaxCategory),
    __metadata("design:type", tax_category_entity_1.TaxCategory)
], OrderLine.prototype, "taxCategory", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)({ nullable: true }),
    __metadata("design:type", Object)
], OrderLine.prototype, "taxCategoryId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => asset_entity_1.Asset, asset => asset.featuredInVariants, { onDelete: 'SET NULL' }),
    __metadata("design:type", asset_entity_1.Asset)
], OrderLine.prototype, "featuredAsset", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => order_entity_1.Order, order => order.lines, { onDelete: 'CASCADE' }),
    __metadata("design:type", order_entity_1.Order)
], OrderLine.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => order_line_reference_entity_1.OrderLineReference, lineRef => lineRef.orderLine),
    __metadata("design:type", Array)
], OrderLine.prototype, "linesReferences", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => sale_entity_1.Sale, sale => sale.orderLine),
    __metadata("design:type", Array)
], OrderLine.prototype, "sales", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderLine.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], OrderLine.prototype, "orderPlacedQuantity", void 0);
__decorate([
    (0, money_decorator_1.Money)({ nullable: true }),
    __metadata("design:type", Number)
], OrderLine.prototype, "initialListPrice", void 0);
__decorate([
    (0, money_decorator_1.Money)(),
    __metadata("design:type", Number)
], OrderLine.prototype, "listPrice", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], OrderLine.prototype, "listPriceIncludesTax", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json'),
    __metadata("design:type", Array)
], OrderLine.prototype, "adjustments", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json'),
    __metadata("design:type", Array)
], OrderLine.prototype, "taxLines", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => cancellation_entity_1.Cancellation, cancellation => cancellation.orderLine),
    __metadata("design:type", Array)
], OrderLine.prototype, "cancellations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => allocation_entity_1.Allocation, allocation => allocation.orderLine),
    __metadata("design:type", Array)
], OrderLine.prototype, "allocations", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomOrderLineFields),
    __metadata("design:type", custom_entity_fields_1.CustomOrderLineFields)
], OrderLine.prototype, "customFields", void 0);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], OrderLine.prototype, "unitPrice", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], OrderLine.prototype, "unitPriceWithTax", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], OrderLine.prototype, "unitPriceChangeSinceAdded", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], OrderLine.prototype, "unitPriceWithTaxChangeSinceAdded", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], OrderLine.prototype, "discountedUnitPrice", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], OrderLine.prototype, "discountedUnitPriceWithTax", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], OrderLine.prototype, "proratedUnitPrice", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], OrderLine.prototype, "proratedUnitPriceWithTax", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], OrderLine.prototype, "unitTax", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], OrderLine.prototype, "proratedUnitTax", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], OrderLine.prototype, "taxRate", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], OrderLine.prototype, "linePrice", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], OrderLine.prototype, "linePriceWithTax", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], OrderLine.prototype, "discountedLinePrice", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], OrderLine.prototype, "discountedLinePriceWithTax", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], OrderLine.prototype, "discounts", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], OrderLine.prototype, "lineTax", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], OrderLine.prototype, "proratedLinePrice", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], OrderLine.prototype, "proratedLinePriceWithTax", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], OrderLine.prototype, "proratedLineTax", null);
exports.OrderLine = OrderLine = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], OrderLine);
//# sourceMappingURL=order-line.entity.js.map