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
exports.OrderTestingService = void 0;
const common_1 = require("@nestjs/common");
const instrument_decorator_1 = require("../../common/instrument-decorator");
const tax_utils_1 = require("../../common/tax-utils");
const config_service_1 = require("../../config/config.service");
const transactional_connection_1 = require("../../connection/transactional-connection");
const order_line_entity_1 = require("../../entity/order-line/order-line.entity");
const order_entity_1 = require("../../entity/order/order.entity");
const product_variant_entity_1 = require("../../entity/product-variant/product-variant.entity");
const shipping_line_entity_1 = require("../../entity/shipping-line/shipping-line.entity");
const shipping_method_entity_1 = require("../../entity/shipping-method/shipping-method.entity");
const config_arg_service_1 = require("../helpers/config-arg/config-arg.service");
const order_calculator_1 = require("../helpers/order-calculator/order-calculator");
const product_price_applicator_1 = require("../helpers/product-price-applicator/product-price-applicator");
const shipping_calculator_1 = require("../helpers/shipping-calculator/shipping-calculator");
const translator_service_1 = require("../helpers/translator/translator.service");
/**
 * @description
 * This service is responsible for creating temporary mock Orders against which tests can be run, such as
 * testing a ShippingMethod or Promotion.
 *
 * @docsCategory services
 */
let OrderTestingService = class OrderTestingService {
    constructor(connection, orderCalculator, shippingCalculator, configArgService, configService, productPriceApplicator, translator) {
        this.connection = connection;
        this.orderCalculator = orderCalculator;
        this.shippingCalculator = shippingCalculator;
        this.configArgService = configArgService;
        this.configService = configService;
        this.productPriceApplicator = productPriceApplicator;
        this.translator = translator;
    }
    /**
     * @description
     * Runs a given ShippingMethod configuration against a mock Order to test for eligibility and resulting
     * price.
     */
    async testShippingMethod(ctx, input) {
        const shippingMethod = new shipping_method_entity_1.ShippingMethod({
            checker: this.configArgService.parseInput('ShippingEligibilityChecker', input.checker),
            calculator: this.configArgService.parseInput('ShippingCalculator', input.calculator),
        });
        const mockOrder = await this.buildMockOrder(ctx, input.shippingAddress, input.lines);
        const eligible = await shippingMethod.test(ctx, mockOrder);
        const result = eligible ? await shippingMethod.apply(ctx, mockOrder) : undefined;
        let quote;
        if (result) {
            const { price, priceIncludesTax, taxRate, metadata } = result;
            quote = {
                price: priceIncludesTax ? (0, tax_utils_1.netPriceOf)(price, taxRate) : price,
                priceWithTax: priceIncludesTax ? price : (0, tax_utils_1.grossPriceOf)(price, taxRate),
                metadata,
            };
        }
        return {
            eligible,
            quote,
        };
    }
    /**
     * @description
     * Tests all available ShippingMethods against a mock Order and return those which are eligible. This
     * is intended to simulate a call to the `eligibleShippingMethods` query of the Shop API.
     */
    async testEligibleShippingMethods(ctx, input) {
        const mockOrder = await this.buildMockOrder(ctx, input.shippingAddress, input.lines);
        const eligibleMethods = await this.shippingCalculator.getEligibleShippingMethods(ctx, mockOrder);
        return eligibleMethods
            .map(result => {
            this.translator.translate(result.method, ctx);
            return result;
        })
            .map(result => {
            const { price, taxRate, priceIncludesTax, metadata } = result.result;
            return {
                id: result.method.id,
                price: priceIncludesTax ? (0, tax_utils_1.netPriceOf)(price, taxRate) : price,
                priceWithTax: priceIncludesTax ? price : (0, tax_utils_1.grossPriceOf)(price, taxRate),
                name: result.method.name,
                code: result.method.code,
                description: result.method.description,
                metadata: result.result.metadata,
            };
        });
    }
    async buildMockOrder(ctx, shippingAddress, lines) {
        const { orderItemPriceCalculationStrategy } = this.configService.orderOptions;
        const mockOrder = new order_entity_1.Order({
            lines: [],
            surcharges: [],
            modifications: [],
        });
        mockOrder.shippingAddress = shippingAddress;
        for (const line of lines) {
            const productVariant = await this.connection.getEntityOrThrow(ctx, product_variant_entity_1.ProductVariant, line.productVariantId, { relations: ['taxCategory'] });
            await this.productPriceApplicator.applyChannelPriceAndTax(productVariant, ctx, mockOrder);
            const orderLine = new order_line_entity_1.OrderLine({
                productVariant,
                adjustments: [],
                taxLines: [],
                quantity: line.quantity,
                taxCategory: productVariant.taxCategory,
                taxCategoryId: productVariant.taxCategoryId,
            });
            mockOrder.lines.push(orderLine);
            const { price, priceIncludesTax } = await orderItemPriceCalculationStrategy.calculateUnitPrice(ctx, productVariant, orderLine.customFields || {}, mockOrder, orderLine.quantity);
            const taxRate = productVariant.taxRateApplied;
            orderLine.listPrice = price;
            orderLine.listPriceIncludesTax = priceIncludesTax;
        }
        mockOrder.shippingLines = [
            new shipping_line_entity_1.ShippingLine({
                listPrice: 0,
                listPriceIncludesTax: ctx.channel.pricesIncludeTax,
                taxLines: [],
                adjustments: [],
            }),
        ];
        await this.orderCalculator.applyPriceAdjustments(ctx, mockOrder, []);
        return mockOrder;
    }
};
exports.OrderTestingService = OrderTestingService;
exports.OrderTestingService = OrderTestingService = __decorate([
    (0, common_1.Injectable)(),
    (0, instrument_decorator_1.Instrument)(),
    __metadata("design:paramtypes", [transactional_connection_1.TransactionalConnection,
        order_calculator_1.OrderCalculator,
        shipping_calculator_1.ShippingCalculator,
        config_arg_service_1.ConfigArgService,
        config_service_1.ConfigService,
        product_price_applicator_1.ProductPriceApplicator,
        translator_service_1.TranslatorService])
], OrderTestingService);
//# sourceMappingURL=order-testing.service.js.map