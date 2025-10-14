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
exports.ConfigurableOperationCodec = void 0;
const common_1 = require("@nestjs/common");
const errors_1 = require("../../common/error/errors");
const config_1 = require("../../config");
const collection_filter_1 = require("../../config/catalog/collection-filter");
const config_service_1 = require("../../config/config.service");
const payment_method_eligibility_checker_1 = require("../../config/payment/payment-method-eligibility-checker");
const payment_method_handler_1 = require("../../config/payment/payment-method-handler");
const id_codec_service_1 = require("./id-codec.service");
let ConfigurableOperationCodec = class ConfigurableOperationCodec {
    constructor(configService, idCodecService) {
        this.configService = configService;
        this.idCodecService = idCodecService;
    }
    /**
     * Decodes any ID type arguments of a ConfigurableOperationDef
     */
    decodeConfigurableOperationIds(defType, input) {
        const availableDefs = this.getAvailableDefsOfType(defType);
        for (const operationInput of input) {
            const def = availableDefs.find(d => d.code === operationInput.code);
            if (!def) {
                continue;
            }
            for (const arg of operationInput.arguments) {
                const argDef = def.args[arg.name];
                if (argDef && argDef.type === 'ID' && arg.value) {
                    if (argDef.list === true) {
                        const ids = JSON.parse(arg.value);
                        const decodedIds = ids.map(id => this.idCodecService.decode(id));
                        arg.value = JSON.stringify(decodedIds);
                    }
                    else {
                        arg.value = this.idCodecService.decode(arg.value);
                    }
                }
            }
        }
        return input;
    }
    /**
     * Encodes any ID type arguments of a ConfigurableOperationDef
     */
    encodeConfigurableOperationIds(defType, input) {
        const availableDefs = this.getAvailableDefsOfType(defType);
        for (const operationInput of input) {
            const def = availableDefs.find(d => d.code === operationInput.code);
            if (!def) {
                continue;
            }
            for (const arg of operationInput.args) {
                const argDef = def.args[arg.name];
                if (argDef && argDef.type === 'ID' && arg.value) {
                    if (argDef.list === true) {
                        const ids = JSON.parse(arg.value);
                        const encodedIds = ids.map(id => this.idCodecService.encode(id));
                        arg.value = JSON.stringify(encodedIds);
                    }
                    else {
                        const encodedId = this.idCodecService.encode(arg.value);
                        arg.value = JSON.stringify(encodedId);
                    }
                }
            }
        }
        return input;
    }
    getAvailableDefsOfType(defType) {
        switch (defType) {
            case collection_filter_1.CollectionFilter:
                return this.configService.catalogOptions.collectionFilters;
            case payment_method_handler_1.PaymentMethodHandler:
                return this.configService.paymentOptions.paymentMethodHandlers;
            case payment_method_eligibility_checker_1.PaymentMethodEligibilityChecker:
                return this.configService.paymentOptions.paymentMethodEligibilityCheckers || [];
            case config_1.PromotionItemAction:
            case config_1.PromotionOrderAction:
                return this.configService.promotionOptions.promotionActions || [];
            case config_1.PromotionCondition:
                return this.configService.promotionOptions.promotionConditions || [];
            case config_1.ShippingEligibilityChecker:
                return this.configService.shippingOptions.shippingEligibilityCheckers || [];
            case config_1.ShippingCalculator:
                return this.configService.shippingOptions.shippingCalculators || [];
            default:
                throw new errors_1.InternalServerError('error.unknown-configurable-operation-definition', {
                    name: defType.name,
                });
        }
    }
};
exports.ConfigurableOperationCodec = ConfigurableOperationCodec;
exports.ConfigurableOperationCodec = ConfigurableOperationCodec = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService, id_codec_service_1.IdCodecService])
], ConfigurableOperationCodec);
//# sourceMappingURL=configurable-operation-codec.js.map