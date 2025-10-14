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
exports.Payment = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const money_decorator_1 = require("../money.decorator");
const order_entity_1 = require("../order/order.entity");
const refund_entity_1 = require("../refund/refund.entity");
/**
 * @description
 * A Payment represents a single payment transaction and exists in a well-defined state
 * defined by the {@link PaymentState} type.
 *
 * @docsCategory entities
 */
let Payment = class Payment extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.Payment = Payment;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Payment.prototype, "method", void 0);
__decorate([
    (0, money_decorator_1.Money)(),
    __metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], Payment.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Payment.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json'),
    __metadata("design:type", Object)
], Payment.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => order_entity_1.Order, order => order.payments),
    __metadata("design:type", order_entity_1.Order)
], Payment.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => refund_entity_1.Refund, refund => refund.payment),
    __metadata("design:type", Array)
], Payment.prototype, "refunds", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomPaymentFields),
    __metadata("design:type", custom_entity_fields_1.CustomPaymentFields)
], Payment.prototype, "customFields", void 0);
exports.Payment = Payment = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Payment);
//# sourceMappingURL=payment.entity.js.map