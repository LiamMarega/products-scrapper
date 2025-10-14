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
exports.ProductVariantAsset = void 0;
const typeorm_1 = require("typeorm");
const orderable_asset_entity_1 = require("../asset/orderable-asset.entity");
const product_variant_entity_1 = require("./product-variant.entity");
let ProductVariantAsset = class ProductVariantAsset extends orderable_asset_entity_1.OrderableAsset {
    constructor(input) {
        super(input);
    }
};
exports.ProductVariantAsset = ProductVariantAsset;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Object)
], ProductVariantAsset.prototype, "productVariantId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => product_variant_entity_1.ProductVariant, variant => variant.assets, { onDelete: 'CASCADE' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], ProductVariantAsset.prototype, "productVariant", void 0);
exports.ProductVariantAsset = ProductVariantAsset = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], ProductVariantAsset);
//# sourceMappingURL=product-variant-asset.entity.js.map