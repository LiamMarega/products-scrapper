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
exports.ProductOption = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const entity_id_decorator_1 = require("../entity-id.decorator");
const product_option_group_entity_1 = require("../product-option-group/product-option-group.entity");
const product_variant_entity_1 = require("../product-variant/product-variant.entity");
const product_option_translation_entity_1 = require("./product-option-translation.entity");
/**
 * @description
 * A ProductOption is used to differentiate {@link ProductVariant}s from one another.
 *
 * @docsCategory entities
 */
let ProductOption = class ProductOption extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.ProductOption = ProductOption;
__decorate([
    (0, typeorm_1.Column)({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], ProductOption.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductOption.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => product_option_translation_entity_1.ProductOptionTranslation, translation => translation.base, { eager: true }),
    __metadata("design:type", Array)
], ProductOption.prototype, "translations", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => product_option_group_entity_1.ProductOptionGroup, group => group.options),
    __metadata("design:type", product_option_group_entity_1.ProductOptionGroup)
], ProductOption.prototype, "group", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)(),
    __metadata("design:type", Object)
], ProductOption.prototype, "groupId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => product_variant_entity_1.ProductVariant, variant => variant.options),
    __metadata("design:type", Array)
], ProductOption.prototype, "productVariants", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomProductOptionFields),
    __metadata("design:type", custom_entity_fields_1.CustomProductOptionFields)
], ProductOption.prototype, "customFields", void 0);
exports.ProductOption = ProductOption = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], ProductOption);
//# sourceMappingURL=product-option.entity.js.map