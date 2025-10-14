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
exports.Refund = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const entity_id_decorator_1 = require("../entity-id.decorator");
const money_decorator_1 = require("../money.decorator");
const refund_line_entity_1 = require("../order-line-reference/refund-line.entity");
const payment_entity_1 = require("../payment/payment.entity");
/**
 * @description A refund the belongs to an order
 *
 * @docsCategory entities
 */
let Refund = class Refund extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.Refund = Refund;
__decorate([
    (0, money_decorator_1.Money)(),
    __metadata("design:type", Number)
], Refund.prototype, "items", void 0);
__decorate([
    (0, money_decorator_1.Money)(),
    __metadata("design:type", Number)
], Refund.prototype, "shipping", void 0);
__decorate([
    (0, money_decorator_1.Money)(),
    __metadata("design:type", Number)
], Refund.prototype, "adjustment", void 0);
__decorate([
    (0, money_decorator_1.Money)(),
    __metadata("design:type", Number)
], Refund.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Refund.prototype, "method", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Refund.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], Refund.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Refund.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => refund_line_entity_1.RefundLine, line => line.refund),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Refund.prototype, "lines", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => payment_entity_1.Payment, payment => payment.refunds),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", payment_entity_1.Payment)
], Refund.prototype, "payment", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)(),
    __metadata("design:type", Object)
], Refund.prototype, "paymentId", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json'),
    __metadata("design:type", Object)
], Refund.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomRefundFields),
    __metadata("design:type", custom_entity_fields_1.CustomRefundFields)
], Refund.prototype, "customFields", void 0);
exports.Refund = Refund = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Refund);
//# sourceMappingURL=refund.entity.js.map