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
exports.StockMovement = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const entity_id_decorator_1 = require("../entity-id.decorator");
const product_variant_entity_1 = require("../product-variant/product-variant.entity");
const stock_location_entity_1 = require("../stock-location/stock-location.entity");
/**
 * @description
 * A StockMovement is created whenever stock of a particular ProductVariant goes in
 * or out.
 *
 * @docsCategory entities
 * @docsPage StockMovement
 * @docsWeight 0
 */
let StockMovement = class StockMovement extends base_entity_1.VendureEntity {
};
exports.StockMovement = StockMovement;
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar' }),
    __metadata("design:type", String)
], StockMovement.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => product_variant_entity_1.ProductVariant, variant => variant.stockMovements),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], StockMovement.prototype, "productVariant", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => stock_location_entity_1.StockLocation, stockLocation => stockLocation.stockMovements, { onDelete: 'CASCADE' }),
    __metadata("design:type", stock_location_entity_1.StockLocation)
], StockMovement.prototype, "stockLocation", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)(),
    __metadata("design:type", Object)
], StockMovement.prototype, "stockLocationId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], StockMovement.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomStockMovementFields),
    __metadata("design:type", custom_entity_fields_1.CustomStockMovementFields)
], StockMovement.prototype, "customFields", void 0);
exports.StockMovement = StockMovement = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.TableInheritance)({ column: { type: 'varchar', name: 'discriminator' } })
], StockMovement);
//# sourceMappingURL=stock-movement.entity.js.map