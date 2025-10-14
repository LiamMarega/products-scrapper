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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const native_authentication_strategy_1 = require("../../../config/auth/native-authentication-strategy");
const external_authentication_method_entity_1 = require("../../../entity/authentication-method/external-authentication-method.entity");
const user_entity_1 = require("../../../entity/user/user.entity");
const user_service_1 = require("../../../service/services/user.service");
const request_context_1 = require("../../common/request-context");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
let UserEntityResolver = class UserEntityResolver {
    constructor(userService) {
        this.userService = userService;
    }
    async authenticationMethods(ctx, user) {
        let methodEntities = [];
        if (user.authenticationMethods) {
            methodEntities = user.authenticationMethods;
        }
        methodEntities = await this.userService
            .getUserById(ctx, user.id)
            .then(u => { var _a; return (_a = u === null || u === void 0 ? void 0 : u.authenticationMethods) !== null && _a !== void 0 ? _a : []; });
        return methodEntities.map(m => (Object.assign(Object.assign({}, m), { id: m.id.toString(), strategy: m instanceof external_authentication_method_entity_1.ExternalAuthenticationMethod ? m.strategy : native_authentication_strategy_1.NATIVE_AUTH_STRATEGY_NAME })));
    }
    async roles(ctx, user) {
        if (user.roles) {
            return user.roles;
        }
        let roles = [];
        roles = await this.userService.getUserById(ctx, user.id).then(u => { var _a; return (_a = u === null || u === void 0 ? void 0 : u.roles) !== null && _a !== void 0 ? _a : []; });
        return roles;
    }
};
exports.UserEntityResolver = UserEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserEntityResolver.prototype, "authenticationMethods", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserEntityResolver.prototype, "roles", null);
exports.UserEntityResolver = UserEntityResolver = __decorate([
    (0, graphql_1.Resolver)('User'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserEntityResolver);
//# sourceMappingURL=user-entity.resolver.js.map