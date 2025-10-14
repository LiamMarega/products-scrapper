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
exports.AuthResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const generated_graphql_admin_errors_1 = require("../../../common/error/generated-graphql-admin-errors");
const native_authentication_strategy_1 = require("../../../config/auth/native-authentication-strategy");
const config_service_1 = require("../../../config/config.service");
const vendure_logger_1 = require("../../../config/logger/vendure-logger");
const administrator_service_1 = require("../../../service/services/administrator.service");
const auth_service_1 = require("../../../service/services/auth.service");
const user_service_1 = require("../../../service/services/user.service");
const request_context_1 = require("../../common/request-context");
const allow_decorator_1 = require("../../decorators/allow.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const transaction_decorator_1 = require("../../decorators/transaction.decorator");
const base_auth_resolver_1 = require("../base/base-auth.resolver");
let AuthResolver = class AuthResolver extends base_auth_resolver_1.BaseAuthResolver {
    constructor(authService, userService, configService, administratorService) {
        super(authService, userService, administratorService, configService);
    }
    async login(args, ctx, req, res) {
        const nativeAuthStrategyError = this.requireNativeAuthStrategy();
        if (nativeAuthStrategyError) {
            return nativeAuthStrategyError;
        }
        return (await super.baseLogin(args, ctx, req, res));
    }
    async authenticate(args, ctx, req, res) {
        return (await this.authenticateAndCreateSession(ctx, args, req, res));
    }
    logout(ctx, req, res) {
        return super.logout(ctx, req, res);
    }
    me(ctx) {
        return super.me(ctx, 'admin');
    }
    requireNativeAuthStrategy() {
        const { adminAuthenticationStrategy } = this.configService.authOptions;
        const nativeAuthStrategyIsConfigured = !!adminAuthenticationStrategy.find(strategy => strategy.name === native_authentication_strategy_1.NATIVE_AUTH_STRATEGY_NAME);
        if (!nativeAuthStrategyIsConfigured) {
            const authStrategyNames = adminAuthenticationStrategy.map(s => s.name).join(', ');
            const errorMessage = 'This GraphQL operation requires that the NativeAuthenticationStrategy be configured for the Admin API.\n' +
                `Currently the following AuthenticationStrategies are enabled: ${authStrategyNames}`;
            vendure_logger_1.Logger.error(errorMessage);
            return new generated_graphql_admin_errors_1.NativeAuthStrategyError();
        }
    }
};
exports.AuthResolver = AuthResolver;
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.Public),
    __param(0, (0, graphql_1.Args)()),
    __param(1, (0, request_context_decorator_1.Ctx)()),
    __param(2, (0, graphql_1.Context)('req')),
    __param(3, (0, graphql_1.Context)('res')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_context_1.RequestContext, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.Public),
    __param(0, (0, graphql_1.Args)()),
    __param(1, (0, request_context_decorator_1.Ctx)()),
    __param(2, (0, graphql_1.Context)('req')),
    __param(3, (0, graphql_1.Context)('res')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_context_1.RequestContext, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "authenticate", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.Public),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Context)('req')),
    __param(2, (0, graphql_1.Context)('res')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "logout", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.Authenticated, generated_types_1.Permission.Owner),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext]),
    __metadata("design:returntype", void 0)
], AuthResolver.prototype, "me", null);
exports.AuthResolver = AuthResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService,
        config_service_1.ConfigService,
        administrator_service_1.AdministratorService])
], AuthResolver);
//# sourceMappingURL=auth.resolver.js.map