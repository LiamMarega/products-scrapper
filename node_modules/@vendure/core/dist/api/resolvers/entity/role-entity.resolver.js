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
exports.RoleEntityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const role_entity_1 = require("../../../entity/role/role.entity");
const role_service_1 = require("../../../service/services/role.service");
const request_context_1 = require("../../common/request-context");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
let RoleEntityResolver = class RoleEntityResolver {
    constructor(roleService) {
        this.roleService = roleService;
    }
    async channels(ctx, role) {
        if (role.channels) {
            return role.channels;
        }
        return this.roleService.getChannelsForRole(ctx, role.id);
    }
};
exports.RoleEntityResolver = RoleEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, role_entity_1.Role]),
    __metadata("design:returntype", Promise)
], RoleEntityResolver.prototype, "channels", null);
exports.RoleEntityResolver = RoleEntityResolver = __decorate([
    (0, graphql_1.Resolver)('Role'),
    __metadata("design:paramtypes", [role_service_1.RoleService])
], RoleEntityResolver);
//# sourceMappingURL=role-entity.resolver.js.map