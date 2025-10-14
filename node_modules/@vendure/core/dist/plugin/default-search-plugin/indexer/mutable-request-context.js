"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutableRequestContext = void 0;
const request_context_1 = require("../../../api/common/request-context");
const channel_entity_1 = require("../../../entity/channel/channel.entity");
/**
 * @description
 * This is used during search index creation to allow us to use a single
 * RequestContext, but mutate the Channel. In this way, we can take
 * full advantage of the RequestContextCacheService, and _massively_ cut
 * down on the number of DB calls being made during indexing.
 */
class MutableRequestContext extends request_context_1.RequestContext {
    constructor(options) {
        super(options);
    }
    setChannel(channel) {
        this.mutatedChannel = channel;
    }
    get channel() {
        var _a;
        return (_a = this.mutatedChannel) !== null && _a !== void 0 ? _a : super.channel;
    }
    get channelId() {
        var _a, _b;
        return (_b = (_a = this.mutatedChannel) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : super.channelId;
    }
    get currencyCode() {
        var _a, _b;
        return (_b = (_a = this.mutatedChannel) === null || _a === void 0 ? void 0 : _a.defaultCurrencyCode) !== null && _b !== void 0 ? _b : super.currencyCode;
    }
    static deserialize(ctxObject) {
        var _a;
        return new MutableRequestContext({
            req: ctxObject._req,
            apiType: ctxObject._apiType,
            channel: new channel_entity_1.Channel(ctxObject._channel),
            session: Object.assign(Object.assign({}, ctxObject._session), { expires: ((_a = ctxObject._session) === null || _a === void 0 ? void 0 : _a.expires) && new Date(ctxObject._session.expires) }),
            languageCode: ctxObject._languageCode,
            isAuthorized: ctxObject._isAuthorized,
            authorizedAsOwnerOnly: ctxObject._authorizedAsOwnerOnly,
        });
    }
}
exports.MutableRequestContext = MutableRequestContext;
//# sourceMappingURL=mutable-request-context.js.map