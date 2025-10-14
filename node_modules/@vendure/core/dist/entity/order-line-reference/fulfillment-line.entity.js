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
exports.FulfillmentLine = void 0;
const typeorm_1 = require("typeorm");
const entity_id_decorator_1 = require("../entity-id.decorator");
const fulfillment_entity_1 = require("../fulfillment/fulfillment.entity");
const order_line_reference_entity_1 = require("./order-line-reference.entity");
/**
 * @description
 * This entity represents a line from an {@link Order} which has been fulfilled by a {@link Fulfillment}.
 *
 * @docsCategory entities
 * @docsPage OrderLineReference
 */
let FulfillmentLine = class FulfillmentLine extends order_line_reference_entity_1.OrderLineReference {
    constructor(input) {
        super(input);
    }
};
exports.FulfillmentLine = FulfillmentLine;
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => fulfillment_entity_1.Fulfillment, fulfillment => fulfillment.lines),
    __metadata("design:type", fulfillment_entity_1.Fulfillment)
], FulfillmentLine.prototype, "fulfillment", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)(),
    __metadata("design:type", Object)
], FulfillmentLine.prototype, "fulfillmentId", void 0);
exports.FulfillmentLine = FulfillmentLine = __decorate([
    (0, typeorm_1.ChildEntity)(),
    __metadata("design:paramtypes", [Object])
], FulfillmentLine);
//# sourceMappingURL=fulfillment-line.entity.js.map