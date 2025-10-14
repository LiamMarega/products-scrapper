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
exports.CustomerResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const customer_entity_1 = require("../../../entity/customer/customer.entity");
const customer_group_service_1 = require("../../../service/services/customer-group.service");
const customer_service_1 = require("../../../service/services/customer.service");
const order_service_1 = require("../../../service/services/order.service");
const request_context_1 = require("../../common/request-context");
const allow_decorator_1 = require("../../decorators/allow.decorator");
const relations_decorator_1 = require("../../decorators/relations.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const transaction_decorator_1 = require("../../decorators/transaction.decorator");
let CustomerResolver = class CustomerResolver {
    constructor(customerService, customerGroupService, orderService) {
        this.customerService = customerService;
        this.customerGroupService = customerGroupService;
        this.orderService = orderService;
    }
    async customers(ctx, args, relations) {
        return this.customerService.findAll(ctx, args.options || undefined, relations);
    }
    async customer(ctx, args, relations) {
        return this.customerService.findOne(ctx, args.id, relations);
    }
    async createCustomer(ctx, args) {
        const { input, password } = args;
        return this.customerService.create(ctx, input, password || undefined);
    }
    async updateCustomer(ctx, args) {
        const { input } = args;
        return this.customerService.update(ctx, input);
    }
    async createCustomerAddress(ctx, args) {
        const { customerId, input } = args;
        return this.customerService.createAddress(ctx, customerId, input);
    }
    async updateCustomerAddress(ctx, args) {
        const { input } = args;
        return this.customerService.updateAddress(ctx, input);
    }
    async deleteCustomerAddress(ctx, args) {
        const { id } = args;
        const success = await this.customerService.deleteAddress(ctx, id);
        return { success };
    }
    async deleteCustomer(ctx, args) {
        const groups = await this.customerService.getCustomerGroups(ctx, args.id);
        for (const group of groups) {
            await this.customerGroupService.removeCustomersFromGroup(ctx, {
                customerGroupId: group.id,
                customerIds: [args.id],
            });
        }
        return this.customerService.softDelete(ctx, args.id);
    }
    async deleteCustomers(ctx, args) {
        return Promise.all(args.ids.map(id => this.deleteCustomer(ctx, { id })));
    }
    async addNoteToCustomer(ctx, args) {
        return this.customerService.addNoteToCustomer(ctx, args.input);
    }
    async updateCustomerNote(ctx, args) {
        return this.customerService.updateCustomerNote(ctx, args.input);
    }
    async deleteCustomerNote(ctx, args) {
        return this.customerService.deleteCustomerNote(ctx, args.id);
    }
};
exports.CustomerResolver = CustomerResolver;
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadCustomer),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __param(2, (0, relations_decorator_1.Relations)({ entity: customer_entity_1.Customer, omit: ['orders'] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object, Array]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "customers", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadCustomer),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __param(2, (0, relations_decorator_1.Relations)({ entity: customer_entity_1.Customer, omit: ['orders'] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object, Array]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "customer", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateCustomer),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "createCustomer", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.UpdateCustomer),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "updateCustomer", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.CreateCustomer),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "createCustomerAddress", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.UpdateCustomer),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "updateCustomerAddress", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.DeleteCustomer),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "deleteCustomerAddress", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.DeleteCustomer),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "deleteCustomer", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.DeleteCustomer),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "deleteCustomers", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.UpdateCustomer),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "addNoteToCustomer", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.UpdateCustomer),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "updateCustomerNote", null);
__decorate([
    (0, transaction_decorator_1.Transaction)(),
    (0, graphql_1.Mutation)(),
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.UpdateCustomer),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "deleteCustomerNote", null);
exports.CustomerResolver = CustomerResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [customer_service_1.CustomerService,
        customer_group_service_1.CustomerGroupService,
        order_service_1.OrderService])
], CustomerResolver);
//# sourceMappingURL=customer.resolver.js.map