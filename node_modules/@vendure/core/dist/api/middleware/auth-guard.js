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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const errors_1 = require("../../common/error/errors");
const config_service_1 = require("../../config/config.service");
const vendure_logger_1 = require("../../config/logger/vendure-logger");
const customer_entity_1 = require("../../entity/customer/customer.entity");
const request_context_service_1 = require("../../service/helpers/request-context/request-context.service");
const channel_service_1 = require("../../service/services/channel.service");
const customer_service_1 = require("../../service/services/customer.service");
const session_service_1 = require("../../service/services/session.service");
const extract_session_token_1 = require("../common/extract-session-token");
const is_field_resolver_1 = require("../common/is-field-resolver");
const parse_context_1 = require("../common/parse-context");
const request_context_1 = require("../common/request-context");
const set_session_token_1 = require("../common/set-session-token");
const allow_decorator_1 = require("../decorators/allow.decorator");
/**
 * @description
 * A guard which:
 *
 * 1. checks for the existence of a valid session token in the request and if found,
 * attaches the current User entity to the request.
 * 2. enforces any permissions required by the target handler (resolver, field resolver or route),
 * and throws a ForbiddenError if those permissions are not present.
 */
let AuthGuard = class AuthGuard {
    constructor(reflector, configService, requestContextService, sessionService, customerService, channelService) {
        this.reflector = reflector;
        this.configService = configService;
        this.requestContextService = requestContextService;
        this.sessionService = sessionService;
        this.customerService = customerService;
        this.channelService = channelService;
    }
    async canActivate(context) {
        const { req, res, info } = (0, parse_context_1.parseContext)(context);
        const targetIsFieldResolver = (0, is_field_resolver_1.isFieldResolver)(info);
        const permissions = this.reflector.get(allow_decorator_1.PERMISSIONS_METADATA_KEY, context.getHandler());
        if (targetIsFieldResolver && !permissions) {
            return true;
        }
        const authDisabled = this.configService.authOptions.disableAuth;
        const isPublic = !!permissions && permissions.includes(generated_types_1.Permission.Public);
        const hasOwnerPermission = !!permissions && permissions.includes(generated_types_1.Permission.Owner);
        let requestContext;
        if (targetIsFieldResolver) {
            requestContext = (0, request_context_1.internal_getRequestContext)(req);
        }
        else {
            const session = await this.getSession(req, res, hasOwnerPermission);
            requestContext = await this.requestContextService.fromRequest(req, info, permissions, session);
            const requestContextShouldBeReinitialized = await this.setActiveChannel(requestContext, session);
            if (requestContextShouldBeReinitialized) {
                requestContext = await this.requestContextService.fromRequest(req, info, permissions, session);
            }
            (0, request_context_1.internal_setRequestContext)(req, requestContext, context);
        }
        if (authDisabled || !permissions || isPublic) {
            return true;
        }
        else {
            const canActivate = requestContext.userHasPermissions(permissions) || requestContext.authorizedAsOwnerOnly;
            if (!canActivate) {
                throw new errors_1.ForbiddenError(vendure_logger_1.LogLevel.Verbose);
            }
            else {
                return canActivate;
            }
        }
    }
    async setActiveChannel(requestContext, session) {
        if (!session) {
            return false;
        }
        // In case the session does not have an activeChannelId or the activeChannelId
        // does not correspond to the current channel, the activeChannelId on the session is set
        const activeChannelShouldBeSet = !session.activeChannelId || session.activeChannelId !== requestContext.channelId;
        if (activeChannelShouldBeSet) {
            await this.sessionService.setActiveChannel(session, requestContext.channel);
            if (requestContext.activeUserId) {
                const customer = await this.customerService.findOneByUserId(requestContext, requestContext.activeUserId, false);
                // To avoid assigning the customer to the active channel on every request,
                // it is only done on the first request and whenever the channel changes
                if (customer) {
                    try {
                        await this.channelService.assignToChannels(requestContext, customer_entity_1.Customer, customer.id, [
                            requestContext.channelId,
                        ]);
                    }
                    catch (e) {
                        const isDuplicateError = e.code === 'ER_DUP_ENTRY' /* mySQL/MariaDB */ ||
                            e.code === '23505'; /* postgres */
                        if (isDuplicateError) {
                            // For a duplicate error, this means that concurrent requests have resulted in attempting to
                            // assign the Customer to the channel more than once. In this case we can safely ignore the
                            // error as the Customer was successfully assigned in the earlier call.
                            // See https://github.com/vendure-ecommerce/vendure/issues/834
                        }
                        else {
                            throw e;
                        }
                    }
                }
            }
            return true;
        }
        return false;
    }
    async getSession(req, res, hasOwnerPermission) {
        const sessionToken = (0, extract_session_token_1.extractSessionToken)(req, this.configService.authOptions.tokenMethod);
        let serializedSession;
        if (sessionToken) {
            serializedSession = await this.sessionService.getSessionFromToken(sessionToken);
            if (serializedSession) {
                return serializedSession;
            }
            // if there is a token but it cannot be validated to a Session,
            // then the token is no longer valid and should be unset.
            (0, set_session_token_1.setSessionToken)({
                req,
                res,
                authOptions: this.configService.authOptions,
                rememberMe: false,
                sessionToken: '',
            });
        }
        if (hasOwnerPermission && !serializedSession) {
            serializedSession = await this.sessionService.createAnonymousSession();
            (0, set_session_token_1.setSessionToken)({
                sessionToken: serializedSession.token,
                rememberMe: true,
                authOptions: this.configService.authOptions,
                req,
                res,
            });
        }
        return serializedSession;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        config_service_1.ConfigService,
        request_context_service_1.RequestContextService,
        session_service_1.SessionService,
        customer_service_1.CustomerService,
        channel_service_1.ChannelService])
], AuthGuard);
//# sourceMappingURL=auth-guard.js.map