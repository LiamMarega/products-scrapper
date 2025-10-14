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
exports.RefundLine = void 0;
const typeorm_1 = require("typeorm");
const entity_id_decorator_1 = require("../entity-id.decorator");
const refund_entity_1 = require("../refund/refund.entity");
const order_line_reference_entity_1 = require("./order-line-reference.entity");
/**
 * @description
 * This entity represents a line from an {@link Order} which has been refunded by a {@link Refund}.
 *
 * @docsCategory entities
 * @docsPage OrderLineReference
 */
let RefundLine = class RefundLine extends order_line_reference_entity_1.OrderLineReference {
    constructor(input) {
        super(input);
    }
};
exports.RefundLine = RefundLine;
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => refund_entity_1.Refund, refund => refund.lines),
    __metadata("design:type", refund_entity_1.Refund)
], RefundLine.prototype, "refund", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)(),
    __metadata("design:type", Object)
], RefundLine.prototype, "refundId", void 0);
exports.RefundLine = RefundLine = __decorate([
    (0, typeorm_1.ChildEntity)(),
    __metadata("design:paramtypes", [Object])
], RefundLine);
//# sourceMappingURL=refund-line.entity.js.map