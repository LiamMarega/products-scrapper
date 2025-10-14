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
exports.FulfillmentAdminEntityResolver = exports.FulfillmentEntityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const request_context_cache_service_1 = require("../../../cache/request-context-cache.service");
const fulfillment_entity_1 = require("../../../entity/fulfillment/fulfillment.entity");
const fulfillment_service_1 = require("../../../service/services/fulfillment.service");
const request_context_1 = require("../../common/request-context");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
let FulfillmentEntityResolver = class FulfillmentEntityResolver {
    constructor(fulfillmentService, requestContextCache) {
        this.fulfillmentService = fulfillmentService;
        this.requestContextCache = requestContextCache;
    }
    async lines(ctx, fulfillment) {
        return this.requestContextCache.get(ctx, `FulfillmentEntityResolver.lines(${fulfillment.id})`, () => this.fulfillmentService.getFulfillmentLines(ctx, fulfillment.id));
    }
    async summary(ctx, fulfillment) {
        return this.requestContextCache.get(ctx, `FulfillmentEntityResolver.lines(${fulfillment.id})`, () => this.fulfillmentService.getFulfillmentLines(ctx, fulfillment.id));
    }
};
exports.FulfillmentEntityResolver = FulfillmentEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, fulfillment_entity_1.Fulfillment]),
    __metadata("design:returntype", Promise)
], FulfillmentEntityResolver.prototype, "lines", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, fulfillment_entity_1.Fulfillment]),
    __metadata("design:returntype", Promise)
], FulfillmentEntityResolver.prototype, "summary", null);
exports.FulfillmentEntityResolver = FulfillmentEntityResolver = __decorate([
    (0, graphql_1.Resolver)('Fulfillment'),
    __metadata("design:paramtypes", [fulfillment_service_1.FulfillmentService,
        request_context_cache_service_1.RequestContextCacheService])
], FulfillmentEntityResolver);
let FulfillmentAdminEntityResolver = class FulfillmentAdminEntityResolver {
    constructor(fulfillmentService) {
        this.fulfillmentService = fulfillmentService;
    }
    async nextStates(fulfillment) {
        return this.fulfillmentService.getNextStates(fulfillment);
    }
};
exports.FulfillmentAdminEntityResolver = FulfillmentAdminEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fulfillment_entity_1.Fulfillment]),
    __metadata("design:returntype", Promise)
], FulfillmentAdminEntityResolver.prototype, "nextStates", null);
exports.FulfillmentAdminEntityResolver = FulfillmentAdminEntityResolver = __decorate([
    (0, graphql_1.Resolver)('Fulfillment'),
    __metadata("design:paramtypes", [fulfillment_service_1.FulfillmentService])
], FulfillmentAdminEntityResolver);
//# sourceMappingURL=fulfillment-entity.resolver.js.map