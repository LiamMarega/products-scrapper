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
exports.StockLevel = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const entity_id_decorator_1 = require("../entity-id.decorator");
const product_variant_entity_1 = require("../product-variant/product-variant.entity");
const stock_location_entity_1 = require("../stock-location/stock-location.entity");
/**
 * @description
 * A StockLevel represents the number of a particular {@link ProductVariant} which are available
 * at a particular {@link StockLocation}.
 *
 * @docsCategory entities
 */
let StockLevel = class StockLevel extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.StockLevel = StockLevel;
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => product_variant_entity_1.ProductVariant, productVariant => productVariant.stockLevels, { onDelete: 'CASCADE' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], StockLevel.prototype, "productVariant", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)(),
    __metadata("design:type", Object)
], StockLevel.prototype, "productVariantId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => stock_location_entity_1.StockLocation, { onDelete: 'CASCADE' }),
    __metadata("design:type", stock_location_entity_1.StockLocation)
], StockLevel.prototype, "stockLocation", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)(),
    __metadata("design:type", Object)
], StockLevel.prototype, "stockLocationId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], StockLevel.prototype, "stockOnHand", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], StockLevel.prototype, "stockAllocated", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomStockLevelFields),
    __metadata("design:type", custom_entity_fields_1.CustomStockLevelFields)
], StockLevel.prototype, "customFields", void 0);
exports.StockLevel = StockLevel = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Index)(['productVariantId', 'stockLocationId'], { unique: true }),
    __metadata("design:paramtypes", [Object])
], StockLevel);
//# sourceMappingURL=stock-level.entity.js.map