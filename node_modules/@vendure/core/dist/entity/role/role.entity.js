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
exports.Role = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
const channel_entity_1 = require("../channel/channel.entity");
/**
 * @description
 * A Role represents a collection of permissions which determine the authorization
 * level of a {@link User} on a given set of {@link Channel}s.
 *
 * @docsCategory entities
 */
let Role = class Role extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.Role = Role;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Role.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Role.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], Role.prototype, "permissions", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => channel_entity_1.Channel, channel => channel.roles),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Role.prototype, "channels", void 0);
exports.Role = Role = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Role);
//# sourceMappingURL=role.entity.js.map