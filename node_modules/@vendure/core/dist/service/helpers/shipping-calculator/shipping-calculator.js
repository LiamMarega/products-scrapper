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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingCalculator = void 0;
const common_1 = require("@nestjs/common");
const shared_utils_1 = require("@vendure/common/lib/shared-utils");
const shipping_method_service_1 = require("../../services/shipping-method.service");
let ShippingCalculator = class ShippingCalculator {
    constructor(shippingMethodService) {
        this.shippingMethodService = shippingMethodService;
    }
    /**
     * Returns an array of each eligible ShippingMethod for the given Order and sorts them by
     * price, with the cheapest first.
     *
     * The `skipIds` argument is used to skip ShippingMethods with those IDs from being checked and calculated.
     */
    async getEligibleShippingMethods(ctx, order, skipIds = []) {
        const shippingMethods = (await this.shippingMethodService.getActiveShippingMethods(ctx)).filter(method => !skipIds.includes(method.id));
        const checkEligibilityPromises = shippingMethods.map(method => this.checkEligibilityByShippingMethod(ctx, order, method));
        const eligibleMethods = await Promise.all(checkEligibilityPromises);
        return eligibleMethods.filter(shared_utils_1.notNullOrUndefined).sort((a, b) => a.result.price - b.result.price);
    }
    async getMethodIfEligible(ctx, order, shippingMethodId) {
        const method = await this.shippingMethodService.findOne(ctx, shippingMethodId);
        if (method) {
            const eligible = await method.test(ctx, order);
            if (eligible) {
                return method;
            }
        }
    }
    async checkEligibilityByShippingMethod(ctx, order, method) {
        const eligible = await method.test(ctx, order);
        if (eligible) {
            const result = await method.apply(ctx, order);
            if (result) {
                return { method, result };
            }
        }
    }
};
exports.ShippingCalculator = ShippingCalculator;
exports.ShippingCalculator = ShippingCalculator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [shipping_method_service_1.ShippingMethodService])
], ShippingCalculator);
//# sourceMappingURL=shipping-calculator.js.map