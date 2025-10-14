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
exports.StockAdjustment = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const typeorm_1 = require("typeorm");
const stock_movement_entity_1 = require("./stock-movement.entity");
/**
 * @description
 * A StockAdjustment is created when the `stockOnHand` level of a ProductVariant is manually adjusted.
 *
 * @docsCategory entities
 * @docsPage StockMovement
 */
let StockAdjustment = class StockAdjustment extends stock_movement_entity_1.StockMovement {
    constructor(input) {
        super(input);
        this.type = generated_types_1.StockMovementType.ADJUSTMENT;
    }
};
exports.StockAdjustment = StockAdjustment;
exports.StockAdjustment = StockAdjustment = __decorate([
    (0, typeorm_1.ChildEntity)(),
    __metadata("design:paramtypes", [Object])
], StockAdjustment);
//# sourceMappingURL=stock-adjustment.entity.js.map