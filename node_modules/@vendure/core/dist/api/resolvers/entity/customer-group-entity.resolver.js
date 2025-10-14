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
exports.CustomerGroupEntityResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const customer_group_entity_1 = require("../../../entity/customer-group/customer-group.entity");
const customer_group_service_1 = require("../../../service/services/customer-group.service");
const request_context_1 = require("../../common/request-context");
const allow_decorator_1 = require("../../decorators/allow.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
let CustomerGroupEntityResolver = class CustomerGroupEntityResolver {
    constructor(customerGroupService) {
        this.customerGroupService = customerGroupService;
    }
    async customers(ctx, customerGroup, args) {
        return this.customerGroupService.getGroupCustomers(ctx, customerGroup.id, args.options || undefined);
    }
};
exports.CustomerGroupEntityResolver = CustomerGroupEntityResolver;
__decorate([
    (0, allow_decorator_1.Allow)(generated_types_1.Permission.ReadCustomer),
    (0, graphql_1.ResolveField)(),
    __param(0, (0, request_context_decorator_1.Ctx)()),
    __param(1, (0, graphql_1.Parent)()),
    __param(2, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_context_1.RequestContext,
        customer_group_entity_1.CustomerGroup, Object]),
    __metadata("design:returntype", Promise)
], CustomerGroupEntityResolver.prototype, "customers", null);
exports.CustomerGroupEntityResolver = CustomerGroupEntityResolver = __decorate([
    (0, graphql_1.Resolver)('CustomerGroup'),
    __metadata("design:paramtypes", [customer_group_service_1.CustomerGroupService])
], CustomerGroupEntityResolver);
//# sourceMappingURL=customer-group-entity.resolver.js.map