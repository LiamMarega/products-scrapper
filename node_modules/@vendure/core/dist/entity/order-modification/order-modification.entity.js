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
exports.OrderModification = void 0;
const typeorm_1 = require("typeorm");
const calculated_decorator_1 = require("../../common/calculated-decorator");
const base_entity_1 = require("../base/base.entity");
const money_decorator_1 = require("../money.decorator");
const order_modification_line_entity_1 = require("../order-line-reference/order-modification-line.entity");
const order_entity_1 = require("../order/order.entity");
const payment_entity_1 = require("../payment/payment.entity");
const refund_entity_1 = require("../refund/refund.entity");
const surcharge_entity_1 = require("../surcharge/surcharge.entity");
/**
 * @description
 * An entity which represents a modification to an order which has been placed, and
 * then modified afterwards by an administrator.
 *
 * @docsCategory entities
 */
let OrderModification = class OrderModification extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
    get isSettled() {
        if (this.priceChange === 0) {
            return true;
        }
        return !!this.payment || !!this.refund;
    }
};
exports.OrderModification = OrderModification;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrderModification.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => order_entity_1.Order, order => order.modifications, { onDelete: 'CASCADE' }),
    __metadata("design:type", order_entity_1.Order)
], OrderModification.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => order_modification_line_entity_1.OrderModificationLine, line => line.modification),
    __metadata("design:type", Array)
], OrderModification.prototype, "lines", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => surcharge_entity_1.Surcharge, surcharge => surcharge.orderModification),
    __metadata("design:type", Array)
], OrderModification.prototype, "surcharges", void 0);
__decorate([
    (0, money_decorator_1.Money)(),
    __metadata("design:type", Number)
], OrderModification.prototype, "priceChange", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => payment_entity_1.Payment),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", payment_entity_1.Payment)
], OrderModification.prototype, "payment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => refund_entity_1.Refund),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", refund_entity_1.Refund)
], OrderModification.prototype, "refund", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], OrderModification.prototype, "shippingAddressChange", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], OrderModification.prototype, "billingAddressChange", void 0);
__decorate([
    (0, calculated_decorator_1.Calculated)(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], OrderModification.prototype, "isSettled", null);
exports.OrderModification = OrderModification = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], OrderModification);
//# sourceMappingURL=order-modification.entity.js.map