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
exports.CacheTag = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../entity/base/base.entity");
const index_1 = require("../../entity/index");
const cache_item_entity_1 = require("./cache-item.entity");
let CacheTag = class CacheTag extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.CacheTag = CacheTag;
__decorate([
    (0, typeorm_1.Index)('cache_tag_tag'),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CacheTag.prototype, "tag", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cache_item_entity_1.CacheItem, { onDelete: 'CASCADE' }),
    __metadata("design:type", cache_item_entity_1.CacheItem)
], CacheTag.prototype, "item", void 0);
__decorate([
    (0, index_1.EntityId)(),
    __metadata("design:type", String)
], CacheTag.prototype, "itemId", void 0);
exports.CacheTag = CacheTag = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(['tag', 'itemId']),
    __metadata("design:paramtypes", [Object])
], CacheTag);
//# sourceMappingURL=cache-tag.entity.js.map