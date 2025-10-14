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
exports.Seller = void 0;
const typeorm_1 = require("typeorm");
const __1 = require("..");
const base_entity_1 = require("../base/base.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
/**
 * @description
 * A Seller represents the person or organization who is selling the goods on a given {@link Channel}.
 * By default, a single-channel Vendure installation will have a single default Seller.
 *
 * @docsCategory entities
 */
let Seller = class Seller extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.Seller = Seller;
__decorate([
    (0, typeorm_1.Column)({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], Seller.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Seller.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomSellerFields),
    __metadata("design:type", custom_entity_fields_1.CustomSellerFields)
], Seller.prototype, "customFields", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => __1.Channel, channel => channel.seller),
    __metadata("design:type", Array)
], Seller.prototype, "channels", void 0);
exports.Seller = Seller = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Seller);
//# sourceMappingURL=seller.entity.js.map