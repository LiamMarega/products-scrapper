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
exports.StockLocation = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
const channel_entity_1 = require("../channel/channel.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const stock_movement_entity_1 = require("../stock-movement/stock-movement.entity");
/**
 * @description
 * A StockLocation represents a physical location where stock is held. For example, a warehouse or a shop.
 *
 * When the stock of a {@link ProductVariant} is adjusted, the adjustment is applied to a specific StockLocation,
 * and the stockOnHand of that ProductVariant is updated accordingly. When there are multiple StockLocations
 * configured, the {@link StockLocationStrategy} is used to determine which StockLocation should be used for
 * a given operation.
 *
 * @docsCategory entities
 */
let StockLocation = class StockLocation extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.StockLocation = StockLocation;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockLocation.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockLocation.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomStockLocationFields),
    __metadata("design:type", custom_entity_fields_1.CustomStockLocationFields)
], StockLocation.prototype, "customFields", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => channel_entity_1.Channel, channel => channel.stockLocations),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], StockLocation.prototype, "channels", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => stock_movement_entity_1.StockMovement, movement => movement.stockLocation),
    __metadata("design:type", Array)
], StockLocation.prototype, "stockMovements", void 0);
exports.StockLocation = StockLocation = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], StockLocation);
//# sourceMappingURL=stock-location.entity.js.map