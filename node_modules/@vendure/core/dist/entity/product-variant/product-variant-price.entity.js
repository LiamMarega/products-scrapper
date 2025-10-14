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
exports.ProductVariantPrice = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const entity_id_decorator_1 = require("../entity-id.decorator");
const money_decorator_1 = require("../money.decorator");
const product_variant_entity_1 = require("./product-variant.entity");
/**
 * @description
 * A ProductVariantPrice is a Channel-specific price for a ProductVariant. For every Channel to
 * which a ProductVariant is assigned, there will be a corresponding ProductVariantPrice entity.
 *
 * @docsCategory entities
 */
let ProductVariantPrice = class ProductVariantPrice extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.ProductVariantPrice = ProductVariantPrice;
__decorate([
    (0, money_decorator_1.Money)(),
    __metadata("design:type", Number)
], ProductVariantPrice.prototype, "price", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)({ nullable: true }),
    __metadata("design:type", Object)
], ProductVariantPrice.prototype, "channelId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], ProductVariantPrice.prototype, "currencyCode", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => product_variant_entity_1.ProductVariant, variant => variant.productVariantPrices, { onDelete: 'CASCADE' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], ProductVariantPrice.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomProductVariantPriceFields),
    __metadata("design:type", custom_entity_fields_1.CustomProductVariantPriceFields)
], ProductVariantPrice.prototype, "customFields", void 0);
exports.ProductVariantPrice = ProductVariantPrice = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], ProductVariantPrice);
//# sourceMappingURL=product-variant-price.entity.js.map