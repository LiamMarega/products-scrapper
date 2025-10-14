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
exports.SearchIndexItem = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const typeorm_1 = require("typeorm");
const entity_id_decorator_1 = require("../../../entity/entity-id.decorator");
const money_decorator_1 = require("../../../entity/money.decorator");
let SearchIndexItem = class SearchIndexItem {
    constructor(input) {
        if (input) {
            for (const [key, value] of Object.entries(input)) {
                this[key] = value;
            }
        }
    }
};
exports.SearchIndexItem = SearchIndexItem;
__decorate([
    (0, entity_id_decorator_1.EntityId)({ primary: true }),
    __metadata("design:type", Object)
], SearchIndexItem.prototype, "productVariantId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)('varchar'),
    __metadata("design:type", String)
], SearchIndexItem.prototype, "languageCode", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)({ primary: true }),
    __metadata("design:type", Object)
], SearchIndexItem.prototype, "channelId", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)(),
    __metadata("design:type", Object)
], SearchIndexItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], SearchIndexItem.prototype, "enabled", void 0);
__decorate([
    (0, typeorm_1.Index)({ fulltext: true }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SearchIndexItem.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Index)({ fulltext: true }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SearchIndexItem.prototype, "productVariantName", void 0);
__decorate([
    (0, typeorm_1.Index)({ fulltext: true }),
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], SearchIndexItem.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SearchIndexItem.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SearchIndexItem.prototype, "sku", void 0);
__decorate([
    (0, money_decorator_1.Money)(),
    __metadata("design:type", Number)
], SearchIndexItem.prototype, "price", void 0);
__decorate([
    (0, money_decorator_1.Money)(),
    __metadata("design:type", Number)
], SearchIndexItem.prototype, "priceWithTax", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], SearchIndexItem.prototype, "facetIds", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], SearchIndexItem.prototype, "facetValueIds", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], SearchIndexItem.prototype, "collectionIds", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], SearchIndexItem.prototype, "collectionSlugs", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], SearchIndexItem.prototype, "channelIds", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SearchIndexItem.prototype, "productPreview", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], SearchIndexItem.prototype, "productPreviewFocalPoint", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SearchIndexItem.prototype, "productVariantPreview", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], SearchIndexItem.prototype, "productVariantPreviewFocalPoint", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)({ nullable: true }),
    __metadata("design:type", Object)
], SearchIndexItem.prototype, "productAssetId", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)({ nullable: true }),
    __metadata("design:type", Object)
], SearchIndexItem.prototype, "productVariantAssetId", void 0);
exports.SearchIndexItem = SearchIndexItem = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], SearchIndexItem);
//# sourceMappingURL=search-index-item.entity.js.map