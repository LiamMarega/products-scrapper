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
exports.Asset = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
const channel_entity_1 = require("../channel/channel.entity");
const collection_entity_1 = require("../collection/collection.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const product_entity_1 = require("../product/product.entity");
const product_variant_entity_1 = require("../product-variant/product-variant.entity");
const tag_entity_1 = require("../tag/tag.entity");
/**
 * @description
 * An Asset represents a file such as an image which can be associated with certain other entities
 * such as Products.
 *
 * @docsCategory entities
 */
let Asset = class Asset extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.Asset = Asset;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Asset.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], Asset.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Asset.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Asset.prototype, "width", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Asset.prototype, "height", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Asset.prototype, "fileSize", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Asset.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Asset.prototype, "preview", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], Asset.prototype, "focalPoint", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => tag_entity_1.Tag),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Asset.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => channel_entity_1.Channel),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Asset.prototype, "channels", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => collection_entity_1.Collection, collection => collection.featuredAsset),
    __metadata("design:type", Array)
], Asset.prototype, "featuredInCollections", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => product_variant_entity_1.ProductVariant, productVariant => productVariant.featuredAsset),
    __metadata("design:type", Array)
], Asset.prototype, "featuredInVariants", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => product_entity_1.Product, product => product.featuredAsset),
    __metadata("design:type", Array)
], Asset.prototype, "featuredInProducts", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomAssetFields),
    __metadata("design:type", custom_entity_fields_1.CustomAssetFields)
], Asset.prototype, "customFields", void 0);
exports.Asset = Asset = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Asset);
//# sourceMappingURL=asset.entity.js.map