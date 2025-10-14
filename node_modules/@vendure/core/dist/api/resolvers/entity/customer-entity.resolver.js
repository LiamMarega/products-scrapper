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
exports.CustomerAdminEntityResolver = exports.CustomerEntityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const customer_entity_1 = require("../../../entity/customer/customer.entity");
const order_entity_1 = require("../../../entity/order/order.entity");
const customer_service_1 = require("../../../service/services/customer.service");
const history_service_1 = require("../../../service/services/history.service");
const order_service_1 = require("../../../service/services/order.service");
const user_service_1 = require("../../../service/services/user.service");
const request_context_1 = require("../../common/request-context");
const api_decorator_1 = require("../../decorators/api.decorator");
const relations_decorator_1 = require("../../decorators/relations.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
let CustomerEntityResolver = class CustomerEntityResolver {
    constructor(customerService, orderService, userService) {
        this.customerService = customerService;
        this.orderService = orderService;
        this.userService = userService;
    }
    async addresses(ctx, customer, apiType) {
        if (apiType === 'shop' && !ctx.activeUserId) {
            // Guest customers should not be able to see this data
            return [];
        }
        return this.customerService.findAddressesByCustomerId(ctx, customer.id);
    }
    async orders(ctx, customer, args, apiType, relations) {
        if (apiType === 'shop' && !ctx.activeUserId) {
            // Guest customers should not be able to see this data
            return { items: [], totalItems: 0 };
        }
        return this.orderService.findByCustomerId(ctx, customer.id, args.options || undefined, relations);
    }
    user(ctx, customer) {
        if (customer.user) {
            return customer.user;
        }
        return this.userService.getUserByEmailAddress(ctx, customer.emailAddress, 'customer');
    }
};
exports.CustomerEntityResolver = CustomerEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __param(2, (0, api_decorator_1.Api)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext,
        customer_entity_1.Customer, String]),
    __metadata("design:returntype", Promise)
], CustomerEntityResolver.prototype, "addresses", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __param(2, (0, graphql_1.Args)()),
    __param(3, (0, api_decorator_1.Api)()),
    __param(4, (0, relations_decorator_1.Relations)(order_entity_1.Order)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext,
        customer_entity_1.Customer, Object, String, Array]),
    __metadata("design:returntype", Promise)
], CustomerEntityResolver.prototype, "orders", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, customer_entity_1.Customer]),
    __metadata("design:returntype", void 0)
], CustomerEntityResolver.prototype, "user", null);
exports.CustomerEntityResolver = CustomerEntityResolver = __decorate([
    (0, graphql_1.Resolver)('Customer'),
    __metadata("design:paramtypes", [customer_service_1.CustomerService,
        order_service_1.OrderService,
        user_service_1.UserService])
], CustomerEntityResolver);
let CustomerAdminEntityResolver = class CustomerAdminEntityResolver {
    constructor(customerService, historyService) {
        this.customerService = customerService;
        this.historyService = historyService;
    }
    groups(ctx, customer) {
        if (customer.groups) {
            return customer.groups;
        }
        return this.customerService.getCustomerGroups(ctx, customer.id);
    }
    async history(ctx, apiType, order, args) {
        const publicOnly = apiType === 'shop';
        const options = Object.assign({}, args.options);
        if (!options.sort) {
            options.sort = { createdAt: generated_types_1.SortOrder.ASC };
        }
        return this.historyService.getHistoryForCustomer(ctx, order.id, publicOnly, options);
    }
};
exports.CustomerAdminEntityResolver = CustomerAdminEntityResolver;
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, customer_entity_1.Customer]),
    __metadata("design:returntype", void 0)
], CustomerAdminEntityResolver.prototype, "groups", null);
__decorate([
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, api_decorator_1.Api)()),
    __param(2, (0, graphql_1.Parent)()),
    __param(3, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, String, order_entity_1.Order, Object]),
    __metadata("design:returntype", Promise)
], CustomerAdminEntityResolver.prototype, "history", null);
exports.CustomerAdminEntityResolver = CustomerAdminEntityResolver = __decorate([
    (0, graphql_1.Resolver)('Customer'),
    __metadata("design:paramtypes", [customer_service_1.CustomerService, history_service_1.HistoryService])
], CustomerAdminEntityResolver);
//# sourceMappingURL=customer-entity.resolver.js.map