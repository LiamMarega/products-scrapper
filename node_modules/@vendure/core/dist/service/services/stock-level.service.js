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
exports.StockLevelService = void 0;
const common_1 = require("@nestjs/common");
const instrument_decorator_1 = require("../../common/instrument-decorator");
const config_service_1 = require("../../config/config.service");
const transactional_connection_1 = require("../../connection/transactional-connection");
const stock_level_entity_1 = require("../../entity/stock-level/stock-level.entity");
const stock_location_service_1 = require("./stock-location.service");
/**
 * @description
 * The StockLevelService is responsible for managing the stock levels of ProductVariants.
 * Whenever you need to adjust the `stockOnHand` or `stockAllocated` for a ProductVariant,
 * you should use this service.
 *
 * @docsCategory services
 * @since 2.0.0
 */
let StockLevelService = class StockLevelService {
    constructor(connection, stockLocationService, configService) {
        this.connection = connection;
        this.stockLocationService = stockLocationService;
        this.configService = configService;
    }
    /**
     * @description
     * Returns the StockLevel for the given {@link ProductVariant} and {@link StockLocation}.
     */
    async getStockLevel(ctx, productVariantId, stockLocationId) {
        const stockLevel = await this.connection.getRepository(ctx, stock_level_entity_1.StockLevel).findOne({
            where: {
                productVariantId,
                stockLocationId,
            },
        });
        if (stockLevel) {
            return stockLevel;
        }
        return this.connection.getRepository(ctx, stock_level_entity_1.StockLevel).save(new stock_level_entity_1.StockLevel({
            productVariantId,
            stockLocationId,
            stockOnHand: 0,
            stockAllocated: 0,
        }));
    }
    async getStockLevelsForVariant(ctx, productVariantId) {
        return this.connection
            .getRepository(ctx, stock_level_entity_1.StockLevel)
            .createQueryBuilder('stockLevel')
            .leftJoinAndSelect('stockLevel.stockLocation', 'stockLocation')
            .leftJoin('stockLocation.channels', 'channel')
            .where('stockLevel.productVariantId = :productVariantId', { productVariantId })
            .andWhere('channel.id = :channelId', { channelId: ctx.channelId })
            .getMany();
    }
    /**
     * @description
     * Returns the available stock (on hand and allocated) for the given {@link ProductVariant}. This is determined
     * by the configured {@link StockLocationStrategy}.
     */
    async getAvailableStock(ctx, productVariantId) {
        const { stockLocationStrategy } = this.configService.catalogOptions;
        const stockLevels = await this.connection.getRepository(ctx, stock_level_entity_1.StockLevel).find({
            where: {
                productVariantId,
            },
        });
        return stockLocationStrategy.getAvailableStock(ctx, productVariantId, stockLevels);
    }
    /**
     * @description
     * Updates the `stockOnHand` for the given {@link ProductVariant} and {@link StockLocation}.
     */
    async updateStockOnHandForLocation(ctx, productVariantId, stockLocationId, change) {
        const stockLevel = await this.connection.getRepository(ctx, stock_level_entity_1.StockLevel).findOne({
            where: {
                productVariantId,
                stockLocationId,
            },
        });
        if (!stockLevel) {
            await this.connection.getRepository(ctx, stock_level_entity_1.StockLevel).save(new stock_level_entity_1.StockLevel({
                productVariantId,
                stockLocationId,
                stockOnHand: change,
                stockAllocated: 0,
            }));
        }
        if (stockLevel) {
            await this.connection
                .getRepository(ctx, stock_level_entity_1.StockLevel)
                .update(stockLevel.id, { stockOnHand: stockLevel.stockOnHand + change });
        }
    }
    /**
     * @description
     * Updates the `stockAllocated` for the given {@link ProductVariant} and {@link StockLocation}.
     */
    async updateStockAllocatedForLocation(ctx, productVariantId, stockLocationId, change) {
        const stockLevel = await this.connection.getRepository(ctx, stock_level_entity_1.StockLevel).findOne({
            where: {
                productVariantId,
                stockLocationId,
            },
        });
        if (stockLevel) {
            await this.connection
                .getRepository(ctx, stock_level_entity_1.StockLevel)
                .update(stockLevel.id, { stockAllocated: stockLevel.stockAllocated + change });
        }
    }
};
exports.StockLevelService = StockLevelService;
exports.StockLevelService = StockLevelService = __decorate([
    (0, common_1.Injectable)(),
    (0, instrument_decorator_1.Instrument)(),
    __metadata("design:paramtypes", [transactional_connection_1.TransactionalConnection,
        stock_location_service_1.StockLocationService,
        config_service_1.ConfigService])
], StockLevelService);
//# sourceMappingURL=stock-level.service.js.map