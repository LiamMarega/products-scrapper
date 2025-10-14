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
exports.ChannelEntityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const channel_entity_1 = require("../../../entity/channel/channel.entity");
const seller_service_1 = require("../../../service/services/seller.service");
const request_context_1 = require("../../common/request-context");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
let ChannelEntityResolver = class ChannelEntityResolver {
    constructor(sellerService) {
        this.sellerService = sellerService;
    }
    async seller(ctx, channel) {
        var _a;
        return channel.sellerId
            ? (_a = channel.seller) !== null && _a !== void 0 ? _a : (await this.sellerService.findOne(ctx, channel.sellerId))
            : undefined;
    }
    currencyCode(ctx, channel) {
        return channel.defaultCurrencyCode;
    }
};
exports.ChannelEntityResolver = ChannelEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, channel_entity_1.Channel]),
    __metadata("design:returntype", Promise)
], ChannelEntityResolver.prototype, "seller", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, channel_entity_1.Channel]),
    __metadata("design:returntype", String)
], ChannelEntityResolver.prototype, "currencyCode", null);
exports.ChannelEntityResolver = ChannelEntityResolver = __decorate([
    (0, graphql_1.Resolver)('Channel'),
    __metadata("design:paramtypes", [seller_service_1.SellerService])
], ChannelEntityResolver);
//# sourceMappingURL=channel-entity.resolver.js.map