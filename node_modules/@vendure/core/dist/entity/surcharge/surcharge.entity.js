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
exports.Surcharge = void 0;
const shared_utils_1 = require("@vendure/common/lib/shared-utils");
const typeorm_1 = require("typeorm");
const calculated_decorator_1 = require("../../common/calculated-decorator");
const round_money_1 = require("../../common/round-money");
const tax_utils_1 = require("../../common/tax-utils");
const base_entity_1 = require("../base/base.entity");
const money_decorator_1 = require("../money.decorator");
const order_entity_1 = require("../order/order.entity");
const order_modification_entity_1 = require("../order-modification/order-modification.entity");
/**
 * @description
 * A Surcharge represents an arbitrary extra item on an {@link Order} which is not
 * a ProductVariant. It can be used to e.g. represent payment-related surcharges.
 *
 * @docsCategory entities
 */
let Surcharge = class Surcharge extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
    get price() {
        return (0, round_money_1.roundMoney)(this.listPriceIncludesTax ? (0, tax_utils_1.netPriceOf)(this.listPrice, this.taxRate) : this.listPrice);
    }
    get priceWithTax() {
        return (0, round_money_1.roundMoney)(this.listPriceIncludesTax ? this.listPrice : (0, tax_utils_1.grossPriceOf)(this.listPrice, this.taxRate));
    }
    get taxRate() {
        return (0, shared_utils_1.summate)(this.taxLines, 'taxRate');
    }
};
exports.Surcharge = Surcharge;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Surcharge.prototype, "description", void 0);
__decorate([
    (0, money_decorator_1.Money)(),
    __metadata("design:type", Number)
], Surcharge.prototype, "listPrice", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Surcharge.prototype, "listPriceIncludesTax", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Surcharge.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json'),
    __metadata("design:type", Array)
], Surcharge.prototype, "taxLines", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => order_entity_1.Order, order => order.surcharges, { onDelete: 'CASCADE' }),
    __metadata("design:type", order_entity_1.Order)
], Surcharge.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => order_modification_entity_1.OrderModification, orderModification => orderModification.surcharges),
    __metadata("design:type", order_modification_entity_1.OrderModification)
], Surcharge.prototype, "orderModification", void 0);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], Surcharge.prototype, "price", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], Surcharge.prototype, "priceWithTax", null);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], Surcharge.prototype, "taxRate", null);
exports.Surcharge = Surcharge = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Surcharge);
//# sourceMappingURL=surcharge.entity.js.map