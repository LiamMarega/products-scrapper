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
exports.ShippingLineEntityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const shipping_line_entity_1 = require("../../../entity/shipping-line/shipping-line.entity");
const shipping_method_service_1 = require("../../../service/services/shipping-method.service");
const request_context_1 = require("../../common/request-context");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
let ShippingLineEntityResolver = class ShippingLineEntityResolver {
    constructor(shippingMethodService) {
        this.shippingMethodService = shippingMethodService;
    }
    async shippingMethod(ctx, shippingLine) {
        if (shippingLine.shippingMethodId) {
            // Does not need to be decoded because it is an internal property
            // which is never exposed to the outside world.
            const shippingMethodId = shippingLine.shippingMethodId;
            return this.shippingMethodService.findOne(ctx, shippingMethodId, true);
        }
        else {
            return null;
        }
    }
};
exports.ShippingLineEntityResolver = ShippingLineEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, shipping_line_entity_1.ShippingLine]),
    __metadata("design:returntype", Promise)
], ShippingLineEntityResolver.prototype, "shippingMethod", null);
exports.ShippingLineEntityResolver = ShippingLineEntityResolver = __decorate([
    (0, graphql_1.Resolver)('ShippingLine'),
    __metadata("design:paramtypes", [shipping_method_service_1.ShippingMethodService])
], ShippingLineEntityResolver);
//# sourceMappingURL=shipping-line-entity.resolver.js.map