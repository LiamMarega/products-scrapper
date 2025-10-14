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
exports.Administrator = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const user_entity_1 = require("../user/user.entity");
/**
 * @description
 * An administrative user who has access to the Admin UI and Admin API. The
 * specific permissions of the Administrator are determined by the assigned
 * {@link Role}s.
 *
 * @docsCategory entities
 */
let Administrator = class Administrator extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
};
exports.Administrator = Administrator;
__decorate([
    (0, typeorm_1.Column)({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], Administrator.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Administrator.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Administrator.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Administrator.prototype, "emailAddress", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(type => user_entity_1.User),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], Administrator.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomAdministratorFields),
    __metadata("design:type", custom_entity_fields_1.CustomAdministratorFields)
], Administrator.prototype, "customFields", void 0);
exports.Administrator = Administrator = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Administrator);
//# sourceMappingURL=administrator.entity.js.map