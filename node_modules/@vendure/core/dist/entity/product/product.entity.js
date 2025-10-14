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
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const asset_entity_1 = require("../asset/asset.entity");
const base_entity_1 = require("../base/base.entity");
const channel_entity_1 = require("../channel/channel.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const entity_id_decorator_1 = require("../entity-id.decorator");
const facet_value_entity_1 = require("../facet-value/facet-value.entity");
const product_option_group_entity_1 = require("../product-option-group/product-option-group.entity");
const product_variant_entity_1 = require("../product-variant/product-variant.entity");
const product_asset_entity_1 = require("./product-asset.entity");
const product_translation_entity_1 = require("./product-translation.entity");
/**
 * @description
 * A Product contains one or more {@link ProductVariant}s and serves as a container for those variants,
 * providing an overall name, description etc.
 *
 * @docsCategory entities
 */
let Product = class Product extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.Column)({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "enabled", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => asset_entity_1.Asset, asset => asset.featuredInProducts, { onDelete: 'SET NULL' }),
    __metadata("design:type", asset_entity_1.Asset)
], Product.prototype, "featuredAsset", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)({ nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "featuredAssetId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => product_asset_entity_1.ProductAsset, productAsset => productAsset.product),
    __metadata("design:type", Array)
], Product.prototype, "assets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => product_translation_entity_1.ProductTranslation, translation => translation.base, { eager: true }),
    __metadata("design:type", Array)
], Product.prototype, "translations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => product_variant_entity_1.ProductVariant, variant => variant.product),
    __metadata("design:type", Array)
], Product.prototype, "variants", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => product_option_group_entity_1.ProductOptionGroup, optionGroup => optionGroup.product),
    __metadata("design:type", Array)
], Product.prototype, "optionGroups", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => facet_value_entity_1.FacetValue, facetValue => facetValue.products),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Product.prototype, "facetValues", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => channel_entity_1.Channel, channel => channel.products),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Product.prototype, "channels", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomProductFields),
    __metadata("design:type", custom_entity_fields_1.CustomProductFields)
], Product.prototype, "customFields", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Product);
//# sourceMappingURL=product.entity.js.map