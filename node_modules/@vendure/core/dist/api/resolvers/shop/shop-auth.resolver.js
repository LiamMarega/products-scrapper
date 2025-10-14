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
exports.ShopAuthResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const generated_shop_types_1 = require("@vendure/common/lib/generated-shop-types");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const error_result_1 = require("../../../common/error/error-result");
const errors_1 = require("../../../common/error/errors");
const generated_graphql_shop_errors_1 = require("../../../common/error/generated-graphql-shop-errors");
const native_authentication_strategy_1 = require("../../../config/auth/native-authentication-strategy");
const config_service_1 = require("../../../config/config.service");
const vendure_logger_1 = require("../../../config/logger/vendure-logger");
const administrator_service_1 = require("../../../service/services/administrator.service");
const auth_service_1 = require("../../../service/services/auth.service");
const customer_service_1 = require("../../../service/services/customer.service");
const history_service_1 = require("../../../service/services/history.service");
const user_service_1 = require("../../../service/services/user.service");
const request_context_1 = require("../../common/request-context");
const set_session_token_1 = require("../../common/set-session-token");
const allow_decorator_1 = require("../../decorators/allow.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const transaction_decorator_1 = require("../../decorators/transaction.decorator");
const base_auth_resolver_1 = require("../base/base-auth.resolver");
let ShopAuthResolver = class ShopAuthResolver extends base_auth_resolver_1.BaseAuthResolver {
    constructor(authService, userService, administratorService, configService, customerService, historyService) {
        super(authService, userService, administratorService, configService);
        this.customerService = customerService;
        this.historyService = historyService;
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
    async logout(ctx, req, res) {
        return super.logout(ctx, req, res);
    }
    me(ctx) {
        return super.me(ctx, 'shop');
    }
    async registerCustomerAccount(ctx, args) {
        const nativeAuthStrategyError = this.requireNativeAuthStrategy();
        if (nativeAuthStrategyError) {
            return nativeAuthStrategyError;
        }
        const result = await this.customerService.registerCustomerAccount(ctx, args.input);
        if ((0, error_result_1.isGraphQlErrorResult)(result)) {
            if (result.errorCode === generated_shop_types_1.ErrorCode.EMAIL_ADDRESS_CONFLICT_ERROR) {
                // We do not want to reveal the email address conflict,
                // otherwise account enumeration attacks become possible.
                return { success: true };
            }
            return result;
        }
        return { success: true };
    }
    async verifyCustomerAccount(ctx, args, req, res) {
        const nativeAuthStrategyError = this.requireNativeAuthStrategy();
        if (nativeAuthStrategyError) {
            return nativeAuthStrategyError;
        }
        const { token, password } = args;
        const customer = await this.customerService.verifyCustomerEmailAddress(ctx, token, password || undefined);
        if ((0, error_result_1.isGraphQlErrorResult)(customer)) {
            return customer;
        }
        const session = await this.authService.createAuthenticatedSessionForUser(ctx, 
        // We know that there is a user, since the Customer
        // was found with the .getCustomerByUserId() method.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        customer.user, native_authentication_strategy_1.NATIVE_AUTH_STRATEGY_NAME);
        if ((0, error_result_1.isGraphQlErrorResult)(session)) {
            // This code path should never be reached - in this block
            // the type of `session` is `NotVerifiedError`, however we
            // just successfully verified the user above. So throw it
            // so that we have some record of the error if it somehow
            // occurs.
            throw session;
        }
        (0, set_session_token_1.setSessionToken)({
            req,
            res,
            authOptions: this.configService.authOptions,
            rememberMe: true,
            sessionToken: session.token,
        });
        return this.publiclyAccessibleUser(session.user);
    }
    async refreshCustomerVerification(ctx, args) {
        const nativeAuthStrategyError = this.requireNativeAuthStrategy();
        if (nativeAuthStrategyError) {
            return nativeAuthStrategyError;
        }
        await this.customerService.refreshVerificationToken(ctx, args.emailAddress);
        return { success: true };
    }
    async requestPasswordReset(ctx, args) {
        const nativeAuthStrategyError = this.requireNativeAuthStrategy();
        if (nativeAuthStrategyError) {
            return nativeAuthStrategyError;
        }
        await this.customerService.requestPasswordReset(ctx, args.emailAddress);
        return { success: true };
    }
    async resetPassword(ctx, args, req, res) {
        const nativeAuthStrategyError = this.requireNativeAuthStrategy();
        if (nativeAuthStrategyError) {
            return nativeAuthStrategyError;
        }
        const { token, password } = args;
        const resetResult = await this.customerService.resetPassword(ctx, token, password);
        if ((0, error_result_1.isGraphQlErrorResult)(resetResult)) {
            return resetResult;
        }
        const authResult = await super.authenticateAndCreateSession(ctx, {
            input: {
                [native_authentication_strategy_1.NATIVE_AUTH_STRATEGY_NAME]: {
                    username: resetResult.identifier,
                    password: args.password,
                },
            },
        }, req, res);
        if ((0, error_result_1.isGraphQlErrorResult)(authResult) && authResult.__typename === 'NotVerifiedError') {
            return authResult;
        }
        if ((0, error_result_1.isGraphQlErrorResult)(authResult)) {
            // This should never occur in theory
            throw authResult;
        }
        return authResult;
    }
    async updateCustomerPassword(ctx, args) {
        const nativeAuthStrategyError = this.requireNativeAuthStrategy();
        if (nativeAuthStrategyError) {
            return nativeAuthStrategyError;
        }
        const result = await super.updatePassword(ctx, args.currentPassword, args.newPassword);
        if ((0, error_result_1.isGraphQlErrorResult)(result)) {
            return result;
        }
        if (result && ctx.activeUserId) {
            const customer = await this.customerService.findOneByUserId(ctx, ctx.activeUserId);
            if (customer) {
                await this.historyService.createHistoryEntryForCustomer({
                    ctx,
                    customerId: customer.id,
                    type: generated_types_1.HistoryEntryType.CUSTOMER_PASSWORD_UPDATED,
                    data: {},
                });
            }
        }
        return { success: result };
    }
    async requestUpdateCustomerEmailAddress(ctx, args) {
        const nativeAuthStrategyError = this.requireNativeAuthStrategy();
        if (nativeAuthStrategyError) {
            return nativeAuthStrategyError;
        }
        if (!ctx.activeUserId) {
            throw new errors_1.ForbiddenError();
        }
        const verify = await this.authService.verifyUserPassword(ctx, ctx.activeUserId, args.password);
        if ((0, error_result_1.isGraphQlErrorResult)(verify)) {
            return verify;
        }
        const result = await this.customerService.requestUpdateEmailAddress(ctx, ctx.activeUserId, args.newEmailAddress);
        if ((0, error_result_1.isGraphQlErrorResult)(result)) {
            return result;
        }
        return {
            success: result,
        };
    }
    async updateCustomerEmailAddress(ctx, args) {
        const nativeAuthStrategyError = this.requireNativeAuthStrategy();
        if (nativeAuthStrategyError) {
            return nativeAuthStrategyError;
        }
        const result = await this.customerService.updateEmailAddress(ctx, args.token);
        if ((0, error_result_1.isGraphQlErrorResult)(result)) {
            return result;
        }
        return { success: result };
    }
    requireNativeAuthStrategy() {
        const { shopAuthenticationStrategy } = this.configService.authOptions;
        const nativeAuthStrategyIsConfigured = !!shopAuthenticationStrategy.find(strategy => strategy.name === native_authentication_strategy_1.NATIVE_AUTH_STRATEGY_NAME);
        if (!nativeAuthStrategyIsConfigured) {
            const authStrategyNames = shopAuthenticationStrategy.map(s => s.name).join(', ');
            const errorMessage = 'This GraphQL operation requires that the NativeAuthenticationStrategy be configured for the Shop API.\n' +
                `Currently the following AuthenticationStrategies are enabled: ${authStrategyNames}`;
            vendure_logger_1.Logger.error(errorMessage);
            return new generated_graphql_shop_errors_1.NativeAuthStrategyError();
        }
    }
};
exports.ShopAuthResolver = ShopAuthResolver;
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_shop_types_1.Permission.Public),
    __param(0, (0, graphql_1.Args)()),
    __param(1, (0, request_context_decorator_1.Ctx)()),
    __param(2, (0, graphql_1.Context)('req')),
    __param(3, (0, graphql_1.Context)('res')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_context_1.RequestContext, Object, Object]),
    __metadata("design:returntype", Promise)
], ShopAuthResolver.prototype, "login", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_shop_types_1.Permission.Public),
    __param(0, (0, graphql_1.Args)()),
    __param(1, (0, request_context_decorator_1.Ctx)()),
    __param(2, (0, graphql_1.Context)('req')),
    __param(3, (0, graphql_1.Context)('res')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_context_1.RequestContext, Object, Object]),
    __metadata("design:returntype", Promise)
], ShopAuthResolver.prototype, "authenticate", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_shop_types_1.Permission.Public),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Context)('req')),
    __param(2, (0, graphql_1.Context)('res')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object, Object]),
    __metadata("design:returntype", Promise)
], ShopAuthResolver.prototype, "logout", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_shop_types_1.Permission.Authenticated),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext]),
    __metadata("design:returntype", void 0)
], ShopAuthResolver.prototype, "me", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_shop_types_1.Permission.Public),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ShopAuthResolver.prototype, "registerCustomerAccount", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_shop_types_1.Permission.Public),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __param(2, (0, graphql_1.Context)('req')),
    __param(3, (0, graphql_1.Context)('res')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ShopAuthResolver.prototype, "verifyCustomerAccount", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_shop_types_1.Permission.Public),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ShopAuthResolver.prototype, "refreshCustomerVerification", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_shop_types_1.Permission.Public),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ShopAuthResolver.prototype, "requestPasswordReset", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_shop_types_1.Permission.Public),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __param(2, (0, graphql_1.Context)('req')),
    __param(3, (0, graphql_1.Context)('res')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ShopAuthResolver.prototype, "resetPassword", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_shop_types_1.Permission.Owner),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ShopAuthResolver.prototype, "updateCustomerPassword", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_shop_types_1.Permission.Owner),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ShopAuthResolver.prototype, "requestUpdateCustomerEmailAddress", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_shop_types_1.Permission.Owner),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ShopAuthResolver.prototype, "updateCustomerEmailAddress", null);
exports.ShopAuthResolver = ShopAuthResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService,
        administrator_service_1.AdministratorService,
        config_service_1.ConfigService,
        customer_service_1.CustomerService,
        history_service_1.HistoryService])
], ShopAuthResolver);
//# sourceMappingURL=shop-auth.resolver.js.map