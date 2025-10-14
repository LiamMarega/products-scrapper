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
exports.StockLocationResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const stock_location_service_1 = require("../../../service/services/stock-location.service");
const request_context_1 = require("../../common/request-context");
const allow_decorator_1 = require("../../decorators/allow.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const transaction_decorator_1 = require("../../decorators/transaction.decorator");
let StockLocationResolver = class StockLocationResolver {
    constructor(stockLocationService) {
        this.stockLocationService = stockLocationService;
    }
    stockLocation(ctx, args) {
        return this.stockLocationService.findOne(ctx, args.id);
    }
    stockLocations(ctx, args) {
        return this.stockLocationService.findAll(ctx, args.options);
    }
    createStockLocation(ctx, args) {
        return this.stockLocationService.create(ctx, args.input);
    }
    updateStockLocation(ctx, args) {
        return this.stockLocationService.update(ctx, args.input);
    }
    deleteStockLocation(ctx, args) {
        return this.stockLocationService.delete(ctx, args.input);
    }
    deleteStockLocations(ctx, args) {
        return Promise.all(args.input.map(input => this.stockLocationService.delete(ctx, input)));
    }
    assignStockLocationsToChannel(ctx, args) {
        return this.stockLocationService.assignStockLocationsToChannel(ctx, args.input);
    }
    removeStockLocationsFromChannel(ctx, args) {
        return this.stockLocationService.removeStockLocationsFromChannel(ctx, args.input);
    }
};
exports.StockLocationResolver = StockLocationResolver;
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadCatalog, generated_types_1.Permission.ReadStockLocation),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", void 0)
], StockLocationResolver.prototype, "stockLocation", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadCatalog, generated_types_1.Permission.ReadStockLocation),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", void 0)
], StockLocationResolver.prototype, "stockLocations", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, transaction_decorator_1.Transaction)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateStockLocation),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", void 0)
], StockLocationResolver.prototype, "createStockLocation", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, transaction_decorator_1.Transaction)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.UpdateStockLocation),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", void 0)
], StockLocationResolver.prototype, "updateStockLocation", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, transaction_decorator_1.Transaction)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.DeleteStockLocation),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", void 0)
], StockLocationResolver.prototype, "deleteStockLocation", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, transaction_decorator_1.Transaction)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.DeleteStockLocation),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", void 0)
], StockLocationResolver.prototype, "deleteStockLocations", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, transaction_decorator_1.Transaction)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateStockLocation),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", void 0)
], StockLocationResolver.prototype, "assignStockLocationsToChannel", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, transaction_decorator_1.Transaction)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.DeleteStockLocation),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", void 0)
], StockLocationResolver.prototype, "removeStockLocationsFromChannel", null);
exports.StockLocationResolver = StockLocationResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [stock_location_service_1.StockLocationService])
], StockLocationResolver);
//# sourceMappingURL=stock-location.resolver.js.map