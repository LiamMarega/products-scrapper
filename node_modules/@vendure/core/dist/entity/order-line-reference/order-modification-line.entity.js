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
exports.OrderModificationLine = void 0;
const typeorm_1 = require("typeorm");
const entity_id_decorator_1 = require("../entity-id.decorator");
const order_modification_entity_1 = require("../order-modification/order-modification.entity");
const order_line_reference_entity_1 = require("./order-line-reference.entity");
/**
 * @description
 * This entity represents a line from an {@link Order} which has been modified by an {@link OrderModification}.
 *
 * @docsCategory entities
 * @docsPage OrderLineReference
 */
let OrderModificationLine = class OrderModificationLine extends order_line_reference_entity_1.OrderLineReference {
    constructor(input) {
        super(input);
    }
};
exports.OrderModificationLine = OrderModificationLine;
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => order_modification_entity_1.OrderModification, modification => modification.lines),
    __metadata("design:type", order_modification_entity_1.OrderModification)
], OrderModificationLine.prototype, "modification", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)(),
    __metadata("design:type", Object)
], OrderModificationLine.prototype, "modificationId", void 0);
exports.OrderModificationLine = OrderModificationLine = __decorate([
    (0, typeorm_1.ChildEntity)(),
    __metadata("design:paramtypes", [Object])
], OrderModificationLine);
//# sourceMappingURL=order-modification-line.entity.js.map