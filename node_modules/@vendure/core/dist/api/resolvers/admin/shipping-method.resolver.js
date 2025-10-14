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
exports.ShippingMethodResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const shipping_method_entity_1 = require("../../../entity/shipping-method/shipping-method.entity");
const order_testing_service_1 = require("../../../service/services/order-testing.service");
const shipping_method_service_1 = require("../../../service/services/shipping-method.service");
const request_context_1 = require("../../common/request-context");
const allow_decorator_1 = require("../../decorators/allow.decorator");
const relations_decorator_1 = require("../../decorators/relations.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const transaction_decorator_1 = require("../../decorators/transaction.decorator");
let ShippingMethodResolver = class ShippingMethodResolver {
    constructor(shippingMethodService, orderTestingService) {
        this.shippingMethodService = shippingMethodService;
        this.orderTestingService = orderTestingService;
    }
    shippingMethods(ctx, args, relations) {
        return this.shippingMethodService.findAll(ctx, args.options || undefined, relations);
    }
    shippingMethod(ctx, args, relations) {
        return this.shippingMethodService.findOne(ctx, args.id, false, relations);
    }
    shippingEligibilityCheckers(ctx) {
        return this.shippingMethodService.getShippingEligibilityCheckers(ctx);
    }
    shippingCalculators(ctx) {
        return this.shippingMethodService.getShippingCalculators(ctx);
    }
    fulfillmentHandlers(ctx) {
        return this.shippingMethodService.getFulfillmentHandlers(ctx);
    }
    createShippingMethod(ctx, args) {
        const { input } = args;
        return this.shippingMethodService.create(ctx, input);
    }
    updateShippingMethod(ctx, args) {
        const { input } = args;
        return this.shippingMethodService.update(ctx, input);
    }
    deleteShippingMethod(ctx, args) {
        const { id } = args;
        return this.shippingMethodService.softDelete(ctx, id);
    }
    deleteShippingMethods(ctx, args) {
        var _a, _b;
        return Promise.all((_b = (_a = args.ids) === null || _a === void 0 ? void 0 : _a.map(id => this.shippingMethodService.softDelete(ctx, id))) !== null && _b !== void 0 ? _b : []);
    }
    testShippingMethod(ctx, args) {
        const { input } = args;
        return this.orderTestingService.testShippingMethod(ctx, input);
    }
    testEligibleShippingMethods(ctx, args) {
        const { input } = args;
        return this.orderTestingService.testEligibleShippingMethods(ctx, input);
    }
    async assignShippingMethodsToChannel(ctx, args) {
        return await this.shippingMethodService.assignShippingMethodsToChannel(ctx, args.input);
    }
    async removeShippingMethodsFromChannel(ctx, args) {
        return await this.shippingMethodService.removeShippingMethodsFromChannel(ctx, args.input);
    }
};
exports.ShippingMethodResolver = ShippingMethodResolver;
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadSettings, generated_types_1.Permission.ReadShippingMethod),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __param(2, (0, relations_decorator_1.Relations)(shipping_method_entity_1.ShippingMethod)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object, Array]),
    __metadata("design:returntype", Promise)
], ShippingMethodResolver.prototype, "shippingMethods", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadSettings, generated_types_1.Permission.ReadShippingMethod),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __param(2, (0, relations_decorator_1.Relations)(shipping_method_entity_1.ShippingMethod)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object, Array]),
    __metadata("design:returntype", Promise)
], ShippingMethodResolver.prototype, "shippingMethod", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadSettings, generated_types_1.Permission.ReadOrder, generated_types_1.Permission.ReadShippingMethod),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext]),
    __metadata("design:returntype", Array)
], ShippingMethodResolver.prototype, "shippingEligibilityCheckers", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadSettings, generated_types_1.Permission.ReadOrder, generated_types_1.Permission.ReadShippingMethod),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext]),
    __metadata("design:returntype", Array)
], ShippingMethodResolver.prototype, "shippingCalculators", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadSettings, generated_types_1.Permission.ReadOrder, generated_types_1.Permission.ReadShippingMethod),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext]),
    __metadata("design:returntype", Array)
], ShippingMethodResolver.prototype, "fulfillmentHandlers", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateSettings, generated_types_1.Permission.CreateShippingMethod),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ShippingMethodResolver.prototype, "createShippingMethod", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.UpdateSettings, generated_types_1.Permission.UpdateShippingMethod),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ShippingMethodResolver.prototype, "updateShippingMethod", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.DeleteSettings, generated_types_1.Permission.DeleteShippingMethod),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ShippingMethodResolver.prototype, "deleteShippingMethod", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.DeleteSettings, generated_types_1.Permission.DeleteShippingMethod),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ShippingMethodResolver.prototype, "deleteShippingMethods", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadSettings, generated_types_1.Permission.ReadShippingMethod),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", void 0)
], ShippingMethodResolver.prototype, "testShippingMethod", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadSettings, generated_types_1.Permission.ReadShippingMethod),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", void 0)
], ShippingMethodResolver.prototype, "testEligibleShippingMethods", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.UpdateSettings, generated_types_1.Permission.UpdateShippingMethod),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ShippingMethodResolver.prototype, "assignShippingMethodsToChannel", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.DeleteSettings, generated_types_1.Permission.DeleteShippingMethod),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], ShippingMethodResolver.prototype, "removeShippingMethodsFromChannel", null);
exports.ShippingMethodResolver = ShippingMethodResolver = __decorate([
    (0, graphql_1.Resolver)('ShippingMethod'),
    __metadata("design:paramtypes", [shipping_method_service_1.ShippingMethodService,
        order_testing_service_1.OrderTestingService])
], ShippingMethodResolver);
//# sourceMappingURL=shipping-method.resolver.js.map