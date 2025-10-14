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
exports.Zone = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
const channel_entity_1 = require("../channel/channel.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const region_entity_1 = require("../region/region.entity");
const tax_rate_entity_1 = require("../tax-rate/tax-rate.entity");
/**
 * @description
 * A Zone is a grouping of one or more {@link Country} entities. It is used for
 * calculating applicable shipping and taxes.
 *
 * @docsCategory entities
 */
let Zone = class Zone extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.Zone = Zone;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Zone.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => region_entity_1.Region),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Zone.prototype, "members", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomZoneFields),
    __metadata("design:type", custom_entity_fields_1.CustomZoneFields)
], Zone.prototype, "customFields", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => channel_entity_1.Channel, country => country.defaultShippingZone),
    __metadata("design:type", Array)
], Zone.prototype, "defaultShippingZoneChannels", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => channel_entity_1.Channel, country => country.defaultTaxZone),
    __metadata("design:type", Array)
], Zone.prototype, "defaultTaxZoneChannels", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => tax_rate_entity_1.TaxRate, taxRate => taxRate.zone),
    __metadata("design:type", Array)
], Zone.prototype, "taxRates", void 0);
exports.Zone = Zone = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Zone);
//# sourceMappingURL=zone.entity.js.map