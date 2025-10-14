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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const errors_1 = require("../../common/error/errors");
const authentication_method_entity_1 = require("../authentication-method/authentication-method.entity");
const native_authentication_method_entity_1 = require("../authentication-method/native-authentication-method.entity");
const base_entity_1 = require("../base/base.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const role_entity_1 = require("../role/role.entity");
const authenticated_session_entity_1 = require("../session/authenticated-session.entity");
/**
 * @description
 * A User represents any authenticated user of the Vendure API. This includes both
 * {@link Administrator}s as well as registered {@link Customer}s.
 *
 * @docsCategory entities
 */
let User = class User extends base_entity_1.VendureEntity {
    constructor(input) {
        super(input);
    }
    getNativeAuthenticationMethod(strict) {
        if (!this.authenticationMethods) {
            throw new errors_1.InternalServerError('error.user-authentication-methods-not-loaded');
        }
        const match = this.authenticationMethods.find((m) => m instanceof native_authentication_method_entity_1.NativeAuthenticationMethod);
        if (!match && (strict === undefined || strict)) {
            throw new errors_1.InternalServerError('error.native-authentication-methods-not-found');
        }
        return match;
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.Column)({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "identifier", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => authentication_method_entity_1.AuthenticationMethod, method => method.user),
    __metadata("design:type", Array)
], User.prototype, "authenticationMethods", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "verified", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => role_entity_1.Role),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "lastLogin", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomUserFields),
    __metadata("design:type", custom_entity_fields_1.CustomUserFields)
], User.prototype, "customFields", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => authenticated_session_entity_1.AuthenticatedSession, session => session.user),
    __metadata("design:type", Array)
], User.prototype, "sessions", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], User);
//# sourceMappingURL=user.entity.js.map