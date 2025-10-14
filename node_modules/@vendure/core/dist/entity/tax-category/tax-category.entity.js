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
exports.TaxCategory = void 0;
const typeorm_1 = require("typeorm");
const __1 = require("..");
const base_entity_1 = require("../base/base.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const product_variant_entity_1 = require("../product-variant/product-variant.entity");
/**
 * @description
 * A TaxCategory defines what type of taxes to apply to a {@link ProductVariant}.
 *
 * @docsCategory entities
 */
let TaxCategory = class TaxCategory extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.TaxCategory = TaxCategory;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TaxCategory.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], TaxCategory.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomTaxCategoryFields),
    __metadata("design:type", custom_entity_fields_1.CustomTaxCategoryFields)
], TaxCategory.prototype, "customFields", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => product_variant_entity_1.ProductVariant, productVariant => productVariant.taxCategory),
    __metadata("design:type", Array)
], TaxCategory.prototype, "productVariants", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => __1.TaxRate, taxRate => taxRate.category),
    __metadata("design:type", Array)
], TaxCategory.prototype, "taxRates", void 0);
exports.TaxCategory = TaxCategory = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], TaxCategory);
//# sourceMappingURL=tax-category.entity.js.map