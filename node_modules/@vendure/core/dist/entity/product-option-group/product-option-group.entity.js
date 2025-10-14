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
exports.ProductOptionGroup = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const product_entity_1 = require("../product/product.entity");
const product_option_entity_1 = require("../product-option/product-option.entity");
const product_option_group_translation_entity_1 = require("./product-option-group-translation.entity");
/**
 * @description
 * A grouping of one or more {@link ProductOption}s.
 *
 * @docsCategory entities
 */
let ProductOptionGroup = class ProductOptionGroup extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.ProductOptionGroup = ProductOptionGroup;
__decorate([
    (0, typeorm_1.Column)({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], ProductOptionGroup.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductOptionGroup.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => product_option_group_translation_entity_1.ProductOptionGroupTranslation, translation => translation.base, { eager: true }),
    __metadata("design:type", Array)
], ProductOptionGroup.prototype, "translations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => product_option_entity_1.ProductOption, option => option.group),
    __metadata("design:type", Array)
], ProductOptionGroup.prototype, "options", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => product_entity_1.Product, product => product.optionGroups),
    __metadata("design:type", product_entity_1.Product)
], ProductOptionGroup.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomProductOptionGroupFields),
    __metadata("design:type", custom_entity_fields_1.CustomProductOptionGroupFields)
], ProductOptionGroup.prototype, "customFields", void 0);
exports.ProductOptionGroup = ProductOptionGroup = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], ProductOptionGroup);
//# sourceMappingURL=product-option-group.entity.js.map