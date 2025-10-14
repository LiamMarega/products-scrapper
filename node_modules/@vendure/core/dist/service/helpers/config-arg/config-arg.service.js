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
exports.ConfigArgService = void 0;
const common_1 = require("@nestjs/common");
const errors_1 = require("../../../common/error/errors");
const config_service_1 = require("../../../config/config.service");
/**
 * This helper class provides methods relating to ConfigurableOperationDef instances.
 */
let ConfigArgService = class ConfigArgService {
    constructor(configService) {
        this.configService = configService;
        this.definitionsByType = {
            CollectionFilter: this.configService.catalogOptions.collectionFilters,
            EntityDuplicator: this.configService.entityOptions.entityDuplicators,
            FulfillmentHandler: this.configService.shippingOptions.fulfillmentHandlers,
            PaymentMethodEligibilityChecker: this.configService.paymentOptions.paymentMethodEligibilityCheckers || [],
            PaymentMethodHandler: this.configService.paymentOptions.paymentMethodHandlers,
            PromotionAction: this.configService.promotionOptions.promotionActions,
            PromotionCondition: this.configService.promotionOptions.promotionConditions,
            ShippingCalculator: this.configService.shippingOptions.shippingCalculators,
            ShippingEligibilityChecker: this.configService.shippingOptions.shippingEligibilityCheckers,
        };
    }
    getDefinitions(defType) {
        return this.definitionsByType[defType];
    }
    getByCode(defType, code) {
        const defsOfType = this.getDefinitions(defType);
        const match = defsOfType.find(def => def.code === code);
        if (!match) {
            throw new errors_1.UserInputError('error.no-configurable-operation-def-with-code-found', {
                code,
                type: defType,
            });
        }
        return match;
    }
    /**
     * Parses and validates the input to a ConfigurableOperation.
     */
    parseInput(defType, input) {
        const match = this.getByCode(defType, input.code);
        this.validateRequiredFields(input, match);
        const orderedArgs = this.orderArgsToMatchDef(match, input.arguments);
        return {
            code: input.code,
            args: orderedArgs,
        };
    }
    orderArgsToMatchDef(def, args) {
        const output = [];
        for (const name of Object.keys(def.args)) {
            const match = args.find(arg => arg.name === name);
            if (match) {
                output.push(match);
            }
        }
        return output;
    }
    validateRequiredFields(input, def) {
        for (const [name, argDef] of Object.entries(def.args)) {
            if (argDef.required) {
                const inputArg = input.arguments.find(a => a.name === name);
                let valid = false;
                try {
                    if (['string', 'ID', 'datetime'].includes(argDef.type)) {
                        valid = !!inputArg && inputArg.value !== '' && inputArg.value != null;
                    }
                    else {
                        valid = !!inputArg && JSON.parse(inputArg.value) != null;
                    }
                }
                catch (e) {
                    // ignore
                }
                if (!valid) {
                    throw new errors_1.UserInputError('error.configurable-argument-is-required', {
                        name,
                    });
                }
            }
        }
    }
};
exports.ConfigArgService = ConfigArgService;
exports.ConfigArgService = ConfigArgService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], ConfigArgService);
//# sourceMappingURL=config-arg.service.js.map