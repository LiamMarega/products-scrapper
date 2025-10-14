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
exports.Customer = void 0;
const typeorm_1 = require("typeorm");
const address_entity_1 = require("../address/address.entity");
const base_entity_1 = require("../base/base.entity");
const channel_entity_1 = require("../channel/channel.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const customer_group_entity_1 = require("../customer-group/customer-group.entity");
const order_entity_1 = require("../order/order.entity");
const user_entity_1 = require("../user/user.entity");
/**
 * @description
 * This entity represents a customer of the store, typically an individual person. A Customer can be
 * a guest, in which case it has no associated {@link User}. Customers with registered account will
 * have an associated User entity.
 *
 * @docsCategory entities
 */
let Customer = class Customer extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.Customer = Customer;
__decorate([
    (0, typeorm_1.Column)({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], Customer.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customer.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customer.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customer.prototype, "emailAddress", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => customer_group_entity_1.CustomerGroup, group => group.customers),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Customer.prototype, "groups", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => address_entity_1.Address, address => address.customer),
    __metadata("design:type", Array)
], Customer.prototype, "addresses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => order_entity_1.Order, order => order.customer),
    __metadata("design:type", Array)
], Customer.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(type => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], Customer.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomCustomerFields),
    __metadata("design:type", custom_entity_fields_1.CustomCustomerFields)
], Customer.prototype, "customFields", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => channel_entity_1.Channel, channel => channel.customers),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Customer.prototype, "channels", void 0);
exports.Customer = Customer = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Customer);
//# sourceMappingURL=customer.entity.js.map