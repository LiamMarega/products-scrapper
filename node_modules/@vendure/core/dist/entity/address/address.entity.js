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
exports.Address = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const customer_entity_1 = require("../customer/customer.entity");
const country_entity_1 = require("../region/country.entity");
/**
 * @description
 * Represents a {@link Customer}'s address.
 *
 * @docsCategory entities
 */
let Address = class Address extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.Address = Address;
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => customer_entity_1.Customer, customer => customer.addresses),
    __metadata("design:type", customer_entity_1.Customer)
], Address.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], Address.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], Address.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Address.prototype, "streetLine1", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], Address.prototype, "streetLine2", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], Address.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], Address.prototype, "province", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], Address.prototype, "postalCode", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(type => country_entity_1.Country),
    __metadata("design:type", country_entity_1.Country)
], Address.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], Address.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Address.prototype, "defaultShippingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Address.prototype, "defaultBillingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomAddressFields),
    __metadata("design:type", custom_entity_fields_1.CustomAddressFields)
], Address.prototype, "customFields", void 0);
exports.Address = Address = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Address);
//# sourceMappingURL=address.entity.js.map