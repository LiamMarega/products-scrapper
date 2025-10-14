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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContextService = void 0;
const common_1 = require("@nestjs/common");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const ms_1 = __importDefault(require("ms"));
const get_api_type_1 = require("../../../api/common/get-api-type");
const request_context_1 = require("../../../api/common/request-context");
const errors_1 = require("../../../common/error/errors");
const utils_1 = require("../../../common/utils");
const config_service_1 = require("../../../config/config.service");
const channel_entity_1 = require("../../../entity/channel/channel.entity");
const channel_service_1 = require("../../services/channel.service");
const get_user_channels_permissions_1 = require("../utils/get-user-channels-permissions");
/**
 * @description
 * Creates new {@link RequestContext} instances.
 *
 * @docsCategory request
 */
let RequestContextService = class RequestContextService {
    /** @internal */
    constructor(channelService, configService) {
        this.channelService = channelService;
        this.configService = configService;
    }
    /**
     * @description
     * Creates a RequestContext based on the config provided. This can be useful when interacting
     * with services outside the request-response cycle, for example in stand-alone scripts or in
     * worker jobs.
     *
     * @since 1.5.0
     */
    async create(config) {
        const { req, apiType, channelOrToken, languageCode, currencyCode, user, activeOrderId } = config;
        let channel;
        if (channelOrToken instanceof channel_entity_1.Channel) {
            channel = channelOrToken;
        }
        else if (typeof channelOrToken === 'string') {
            channel = await this.channelService.getChannelFromToken(channelOrToken);
        }
        else {
            channel = await this.channelService.getDefaultChannel();
        }
        let session;
        if (user) {
            const channelPermissions = user.roles ? (0, get_user_channels_permissions_1.getUserChannelsPermissions)(user) : [];
            session = {
                user: {
                    id: user.id,
                    identifier: user.identifier,
                    verified: user.verified,
                    channelPermissions,
                },
                id: '__dummy_session_id__',
                token: '__dummy_session_token__',
                expires: new Date(Date.now() + (0, ms_1.default)('1y')),
                cacheExpiry: (0, ms_1.default)('1y'),
                activeOrderId,
            };
        }
        return new request_context_1.RequestContext({
            req,
            apiType,
            channel,
            languageCode,
            currencyCode,
            session,
            isAuthorized: true,
            authorizedAsOwnerOnly: false,
        });
    }
    /**
     * @description
     * Creates a new RequestContext based on an Express request object. This is used internally
     * in the API layer by the AuthGuard, and creates the RequestContext which is then passed
     * to all resolvers & controllers.
     */
    async fromRequest(req, info, requiredPermissions, session) {
        const channelToken = this.getChannelToken(req);
        const channel = await this.channelService.getChannelFromToken(channelToken);
        const apiType = (0, get_api_type_1.getApiType)(info);
        const hasOwnerPermission = !!requiredPermissions && requiredPermissions.includes(generated_types_1.Permission.Owner);
        const languageCode = this.getLanguageCode(req, channel);
        const currencyCode = this.getCurrencyCode(req, channel);
        const user = session && session.user;
        const isAuthorized = this.userHasRequiredPermissionsOnChannel(requiredPermissions, channel, user);
        const authorizedAsOwnerOnly = !isAuthorized && hasOwnerPermission;
        const translationFn = req.t;
        return new request_context_1.RequestContext({
            req,
            apiType,
            channel,
            languageCode,
            currencyCode,
            session,
            isAuthorized,
            authorizedAsOwnerOnly,
            translationFn,
        });
    }
    getChannelToken(req) {
        const tokenKey = this.configService.apiOptions.channelTokenKey;
        let channelToken = '';
        if (req && req.query && req.query[tokenKey]) {
            channelToken = req.query[tokenKey];
        }
        else if (req && req.headers && req.headers[tokenKey]) {
            channelToken = req.headers[tokenKey];
        }
        return channelToken;
    }
    getLanguageCode(req, channel) {
        var _a, _b;
        return ((_b = (_a = (req.query && req.query.languageCode)) !== null && _a !== void 0 ? _a : channel.defaultLanguageCode) !== null && _b !== void 0 ? _b : this.configService.defaultLanguageCode);
    }
    getCurrencyCode(req, channel) {
        const queryCurrencyCode = req.query && req.query.currencyCode;
        if (queryCurrencyCode && !channel.availableCurrencyCodes.includes(queryCurrencyCode)) {
            throw new errors_1.UserInputError('error.currency-not-available-in-channel', {
                currencyCode: queryCurrencyCode,
            });
        }
        return queryCurrencyCode !== null && queryCurrencyCode !== void 0 ? queryCurrencyCode : channel.defaultCurrencyCode;
    }
    /**
     * TODO: Deprecate and remove, since this function is now handled internally in the RequestContext.
     * @private
     */
    userHasRequiredPermissionsOnChannel(permissions = [], channel, user) {
        if (!user || !channel) {
            return false;
        }
        const permissionsOnChannel = user.channelPermissions.find(c => (0, utils_1.idsAreEqual)(c.id, channel.id));
        if (permissionsOnChannel) {
            return this.arraysIntersect(permissionsOnChannel.permissions, permissions);
        }
        return false;
    }
    /**
     * Returns true if any element of arr1 appears in arr2.
     */
    arraysIntersect(arr1, arr2) {
        return arr1.reduce((intersects, role) => {
            return intersects || arr2.includes(role);
        }, false);
    }
};
exports.RequestContextService = RequestContextService;
exports.RequestContextService = RequestContextService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [channel_service_1.ChannelService,
        config_service_1.ConfigService])
], RequestContextService);
//# sourceMappingURL=request-context.service.js.map