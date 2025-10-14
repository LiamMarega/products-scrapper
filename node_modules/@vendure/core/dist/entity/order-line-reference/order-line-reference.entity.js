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
exports.OrderLineReference = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
const entity_id_decorator_1 = require("../entity-id.decorator");
const order_line_entity_1 = require("../order-line/order-line.entity");
/**
 * @description
 * This is an abstract base class for entities which reference an {@link OrderLine}.
 *
 * @docsCategory entities
 * @docsPage OrderLineReference
 */
let OrderLineReference = class OrderLineReference extends base_entity_1.VendureEntity {
};
exports.OrderLineReference = OrderLineReference;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderLineReference.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => order_line_entity_1.OrderLine, line => line.linesReferences, { onDelete: 'CASCADE' }),
    __metadata("design:type", order_line_entity_1.OrderLine)
], OrderLineReference.prototype, "orderLine", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)(),
    __metadata("design:type", Object)
], OrderLineReference.prototype, "orderLineId", void 0);
exports.OrderLineReference = OrderLineReference = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.TableInheritance)({ column: { type: 'varchar', name: 'discriminator' } })
], OrderLineReference);
//# sourceMappingURL=order-line-reference.entity.js.map