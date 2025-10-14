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
exports.ExternalAuthenticationMethod = void 0;
const typeorm_1 = require("typeorm");
const authentication_method_entity_1 = require("./authentication-method.entity");
/**
 * @description
 * This method is used when an external authentication service is used to authenticate Vendure Users.
 * Examples of external auth include social logins or corporate identity servers.
 *
 * @docsCategory entities
 * @docsPage AuthenticationMethod
 */
let ExternalAuthenticationMethod = class ExternalAuthenticationMethod extends authentication_method_entity_1.AuthenticationMethod {
    constructor(input) {
        super(input);
    }
};
exports.ExternalAuthenticationMethod = ExternalAuthenticationMethod;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExternalAuthenticationMethod.prototype, "strategy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExternalAuthenticationMethod.prototype, "externalIdentifier", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json'),
    __metadata("design:type", Object)
], ExternalAuthenticationMethod.prototype, "metadata", void 0);
exports.ExternalAuthenticationMethod = ExternalAuthenticationMethod = __decorate([
    (0, typeorm_1.ChildEntity)(),
    __metadata("design:paramtypes", [Object])
], ExternalAuthenticationMethod);
//# sourceMappingURL=external-authentication-method.entity.js.map