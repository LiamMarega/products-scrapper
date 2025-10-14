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
exports.ZoneEntityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const zone_entity_1 = require("../../../entity/zone/zone.entity");
const zone_service_1 = require("../../../service/services/zone.service");
const request_context_1 = require("../../common/request-context");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
let ZoneEntityResolver = class ZoneEntityResolver {
    constructor(zoneService) {
        this.zoneService = zoneService;
    }
    async members(ctx, zone) {
        var _a;
        if (Array.isArray(zone.members)) {
            return zone.members;
        }
        const zoneWithMembers = await this.zoneService.findOne(ctx, zone.id);
        return (_a = zoneWithMembers === null || zoneWithMembers === void 0 ? void 0 : zoneWithMembers.members) !== null && _a !== void 0 ? _a : [];
    }
};
exports.ZoneEntityResolver = ZoneEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, zone_entity_1.Zone]),
    __metadata("design:returntype", Promise)
], ZoneEntityResolver.prototype, "members", null);
exports.ZoneEntityResolver = ZoneEntityResolver = __decorate([
    (0, graphql_1.Resolver)('Zone'),
    __metadata("design:paramtypes", [zone_service_1.ZoneService])
], ZoneEntityResolver);
//# sourceMappingURL=zone-entity.resolver.js.map