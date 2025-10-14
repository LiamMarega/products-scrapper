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
exports.ChannelResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const error_result_1 = require("../../../common/error/error-result");
const channel_service_1 = require("../../../service/services/channel.service");
const role_service_1 = require("../../../service/services/role.service");
const request_context_1 = require("../../common/request-context");
const allow_decorator_1 = require("../../decorators/allow.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const transaction_decorator_1 = require("../../decorators/transaction.decorator");
let ChannelResolver = class ChannelResolver {
    constructor(channelService, roleService) {
        this.channelService = channelService;
        this.roleService = roleService;
    }
    async channels(ctx, args) {
        return this.channelService.findAll(ctx, args.options || undefined);
    }
    async channel(ctx, args) {
        return this.channelService.findOne(ctx, args.id);
    }
    async activeChannel(ctx) {
        return ctx.channel;
    }
    async createChannel(ctx, args) {
        const result = await this.channelService.create(ctx, args.input);
        if ((0, error_result_1.isGraphQlErrorResult)(result)) {
            return result;
        }
        const superAdminRole = await this.roleService.getSuperAdminRole(ctx);
        const customerRole = await this.roleService.getCustomerRole(ctx);
        await this.roleService.assignRoleToChannel(ctx, superAdminRole.id, result.id);
        await this.roleService.assignRoleToChannel(ctx, customerRole.id, result.id);
        return result;
    }
    async updateChannel(ctx, args) {
        return this.channelService.update(ctx, args.input);
    }
    async deleteChannel(ctx, args) {
        return this.channelService.delete(ctx, args.id);
    }
    async deleteChannels(ctx, args) {
        return Promise.all(args.ids.map(id => this.channelService.delete(ctx, id)));
    }
};
exports.ChannelResolver = ChannelResolver;
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadSettings, generated_types_1.Permission.ReadChannel),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "channels", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadSettings, generated_types_1.Permission.ReadChannel),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "channel", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.Authenticated),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "activeChannel", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.SuperAdmin, generated_types_1.Permission.CreateChannel),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "createChannel", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.SuperAdmin, generated_types_1.Permission.UpdateChannel),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "updateChannel", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.SuperAdmin, generated_types_1.Permission.DeleteChannel),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "deleteChannel", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.SuperAdmin, generated_types_1.Permission.DeleteChannel),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "deleteChannels", null);
exports.ChannelResolver = ChannelResolver = __decorate([
    (0, graphql_1.Resolver)('Channel'),
    __metadata("design:paramtypes", [channel_service_1.ChannelService,
        role_service_1.RoleService])
], ChannelResolver);
//# sourceMappingURL=channel.resolver.js.map