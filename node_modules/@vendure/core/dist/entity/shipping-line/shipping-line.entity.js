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
exports.ShippingLine = void 0;
const shared_utils_1 = require("@vendure/common/lib/shared-utils");
const typeorm_1 = require("typeorm");
const calculated_decorator_1 = require("../../common/calculated-decorator");
const round_money_1 = require("../../common/round-money");
const tax_utils_1 = require("../../common/tax-utils");
const base_entity_1 = require("../base/base.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const entity_id_decorator_1 = require("../entity-id.decorator");
const money_decorator_1 = require("../money.decorator");
const order_entity_1 = require("../order/order.entity");
const order_line_entity_1 = require("../order-line/order-line.entity");
const shipping_method_entity_1 = require("../shipping-method/shipping-method.entity");
/**
 * @description
 * A ShippingLine is created when a {@link ShippingMethod} is applied to an {@link Order}.
 * It contains information about the price of the shipping method, any discounts that were
 * applied, and the resulting tax on the shipping method.
 *
 * @docsCategory entities
 */
let ShippingLine = class ShippingLine extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
    get price() {
        return this.listPriceIncludesTax ? (0, tax_utils_1.netPriceOf)(this.listPrice, this.taxRate) : this.listPrice;
    }
    get priceWithTax() {
        return (0, round_money_1.roundMoney)(this.listPriceIncludesTax ? this.listPrice : (0, tax_utils_1.grossPriceOf)(this.listPrice, this.taxRate));
    }
    get discountedPrice() {
        const result = this.listPrice + this.getAdjustmentsTotal();
        return (0, round_money_1.roundMoney)(this.listPriceIncludesTax ? (0, tax_utils_1.netPriceOf)(result, this.taxRate) : result);
    }
    get discountedPriceWithTax() {
        const result = this.listPrice + this.getAdjustmentsTotal();
        return (0, round_money_1.roundMoney)(this.listPriceIncludesTax ? result : (0, tax_utils_1.grossPriceOf)(result, this.taxRate));
    }
    get taxRate() {
        return (0, shared_utils_1.summate)(this.taxLines, 'taxRate');
    }
    get discounts() {
        var _a, _b;
        return ((_b = (_a = this.adjustments) === null || _a === void 0 ? void 0 : _a.map(adjustment => {
            const amount = (0, round_money_1.roundMoney)(this.listPriceIncludesTax
                ? (0, tax_utils_1.netPriceOf)(adjustment.amount, this.taxRate)
                : adjustment.amount);
            const amountWithTax = (0, round_money_1.roundMoney)(this.listPriceIncludesTax
                ? adjustment.amount
                : (0, tax_utils_1.grossPriceOf)(adjustment.amount, this.taxRate));
            return Object.assign(Object.assign({}, adjustment), { amount,
                amountWithTax });
        })) !== null && _b !== void 0 ? _b : []);
    }
    addAdjustment(adjustment) {
        this.adjustments = this.adjustments.concat(adjustment);
    }
    clearAdjustments() {
        this.adjustments = [];
    }
    /**
     * @description
     * The total of all price adjustments. Will typically be a negative number due to discounts.
     */
    getAdjustmentsTotal() {
        return (0, shared_utils_1.summate)(this.adjustments, 'amount');
    }
};
exports.ShippingLine = ShippingLine;
__decorate([
    (0, entity_id_decorator_1.EntityId)(),
    __metadata("design:type", Object)
], ShippingLine.prototype, "shippingMethodId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => shipping_method_entity_1.ShippingMethod),
    __metadata("design:type", shipping_method_entity_1.ShippingMethod)
], ShippingLine.prototype, "shippingMethod", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => order_entity_1.Order, order => order.shippingLines, { onDelete: 'CASCADE' }),
    __metadata("design:type", order_entity_1.Order)
], ShippingLine.prototype, "order", void 0);
__decorate([
    (0, money_decorator_1.Money)(),
    __metadata("design:type", Number)
], ShippingLine.prototype, "listPrice", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], ShippingLine.prototype, "listPriceIncludesTax", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json'),
    __metadata("design:type", Array)
], ShippingLine.prototype, "adjustments", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json'),
    __metadata("design:type", Array)
], ShippingLine.prototype, "taxLines", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => order_line_entity_1.OrderLine, orderLine => orderLine.shippingLine),
    __metadata("design:type", Array)
], ShippingLine.prototype, "orderLines", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomShippingLineFields),
    __metadata("design:type", custom_entity_fields_1.CustomShippingLineFields)
], ShippingLine.prototype, "customFields", void 0);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], ShippingLine.prototype, "price", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], ShippingLine.prototype, "priceWithTax", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], ShippingLine.prototype, "discountedPrice", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], ShippingLine.prototype, "discountedPriceWithTax", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], ShippingLine.prototype, "taxRate", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], ShippingLine.prototype, "discounts", null);
exports.ShippingLine = ShippingLine = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], ShippingLine);
//# sourceMappingURL=shipping-line.entity.js.map