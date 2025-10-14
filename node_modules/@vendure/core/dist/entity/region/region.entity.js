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
exports.Region = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const entity_id_decorator_1 = require("../entity-id.decorator");
const region_translation_entity_1 = require("./region-translation.entity");
/**
 * @description
 * A Region represents a geographical administrative unit, such as a Country, Province, State, Prefecture etc.
 * This is an abstract class which is extended by the {@link Country} and {@link Province} entities.
 * Regions can be grouped into {@link Zone}s which are in turn used to determine applicable shipping and taxes for an {@link Order}.
 *
 * @docsCategory entities
 */
let Region = class Region extends base_entity_1.VendureEntity {
};
exports.Region = Region;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Region.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar' }),
    __metadata("design:type", String)
], Region.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => Region, { nullable: true, onDelete: 'SET NULL' }),
    __metadata("design:type", Region)
], Region.prototype, "parent", void 0);
__decorate([
    (0, entity_id_decorator_1.EntityId)({ nullable: true }),
    __metadata("design:type", Object)
], Region.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Region.prototype, "enabled", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => region_translation_entity_1.RegionTranslation, translation => translation.base, { eager: true }),
    __metadata("design:type", Array)
], Region.prototype, "translations", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomRegionFields),
    __metadata("design:type", custom_entity_fields_1.CustomRegionFields)
], Region.prototype, "customFields", void 0);
exports.Region = Region = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.TableInheritance)({ column: { type: 'varchar', name: 'discriminator' } })
], Region);
//# sourceMappingURL=region.entity.js.map