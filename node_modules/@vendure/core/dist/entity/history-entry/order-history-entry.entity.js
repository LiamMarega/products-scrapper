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
exports.OrderHistoryEntry = void 0;
const typeorm_1 = require("typeorm");
const order_entity_1 = require("../order/order.entity");
const history_entry_entity_1 = require("./history-entry.entity");
/**
 * @description
 * Represents an event in the history of a particular {@link Order}.
 *
 * @docsCategory entities
 */
let OrderHistoryEntry = class OrderHistoryEntry extends history_entry_entity_1.HistoryEntry {
    constructor(input) {
        super(input);
    }
};
exports.OrderHistoryEntry = OrderHistoryEntry;
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => order_entity_1.Order, { onDelete: 'CASCADE' }),
    __metadata("design:type", order_entity_1.Order)
], OrderHistoryEntry.prototype, "order", void 0);
exports.OrderHistoryEntry = OrderHistoryEntry = __decorate([
    (0, typeorm_1.ChildEntity)(),
    __metadata("design:paramtypes", [Object])
], OrderHistoryEntry);
//# sourceMappingURL=order-history-entry.entity.js.map