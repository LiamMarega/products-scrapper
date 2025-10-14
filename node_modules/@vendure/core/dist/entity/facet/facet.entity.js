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
exports.Facet = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
const channel_entity_1 = require("../channel/channel.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const facet_value_entity_1 = require("../facet-value/facet-value.entity");
const facet_translation_entity_1 = require("./facet-translation.entity");
/**
 * @description
 * A Facet is a class of properties which can be applied to a {@link Product} or {@link ProductVariant}.
 * They are used to enable [faceted search](https://en.wikipedia.org/wiki/Faceted_search) whereby products
 * can be filtered along a number of dimensions (facets).
 *
 * For example, there could be a Facet named "Brand" which has a number of {@link FacetValue}s representing
 * the various brands of product, e.g. "Apple", "Samsung", "Dell", "HP" etc.
 *
 * @docsCategory entities
 */
let Facet = class Facet extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.Facet = Facet;
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Facet.prototype, "isPrivate", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Facet.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => facet_translation_entity_1.FacetTranslation, translation => translation.base, { eager: true }),
    __metadata("design:type", Array)
], Facet.prototype, "translations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => facet_value_entity_1.FacetValue, value => value.facet),
    __metadata("design:type", Array)
], Facet.prototype, "values", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomFacetFields),
    __metadata("design:type", custom_entity_fields_1.CustomFacetFields)
], Facet.prototype, "customFields", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => channel_entity_1.Channel, channel => channel.facets),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Facet.prototype, "channels", void 0);
exports.Facet = Facet = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Facet);
//# sourceMappingURL=facet.entity.js.map