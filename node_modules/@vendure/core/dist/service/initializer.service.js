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
exports.InitializerService = void 0;
const common_1 = require("@nestjs/common");
const vendure_logger_1 = require("../config/logger/vendure-logger");
const transactional_connection_1 = require("../connection/transactional-connection");
const administrator_entity_1 = require("../entity/administrator/administrator.entity");
const event_bus_1 = require("../event-bus");
const initializer_event_1 = require("../event-bus/events/initializer-event");
const administrator_service_1 = require("./services/administrator.service");
const channel_service_1 = require("./services/channel.service");
const global_settings_service_1 = require("./services/global-settings.service");
const role_service_1 = require("./services/role.service");
const seller_service_1 = require("./services/seller.service");
const shipping_method_service_1 = require("./services/shipping-method.service");
const stock_location_service_1 = require("./services/stock-location.service");
const tax_rate_service_1 = require("./services/tax-rate.service");
const zone_service_1 = require("./services/zone.service");
/**
 * @description
 * Only used internally to run the various service init methods in the correct
 * sequence on bootstrap.
 *
 * @docsCategory services
 */
let InitializerService = class InitializerService {
    constructor(connection, zoneService, channelService, roleService, administratorService, shippingMethodService, globalSettingsService, taxRateService, sellerService, eventBus, stockLocationService) {
        this.connection = connection;
        this.zoneService = zoneService;
        this.channelService = channelService;
        this.roleService = roleService;
        this.administratorService = administratorService;
        this.shippingMethodService = shippingMethodService;
        this.globalSettingsService = globalSettingsService;
        this.taxRateService = taxRateService;
        this.sellerService = sellerService;
        this.eventBus = eventBus;
        this.stockLocationService = stockLocationService;
    }
    async onModuleInit() {
        await this.awaitDbSchemaGeneration();
        // IMPORTANT - why manually invoke these init methods rather than just relying on
        // Nest's "onModuleInit" lifecycle hook within each individual service class?
        // The reason is that the order of invocation matters. By explicitly invoking the
        // methods below, we can e.g. guarantee that the default channel exists
        // (channelService.initChannels()) before we try to create any roles (which assume that
        // there is a default Channel to work with.
        await this.zoneService.initZones();
        await this.globalSettingsService.initGlobalSettings();
        await this.sellerService.initSellers();
        await this.channelService.initChannels();
        await this.roleService.initRoles();
        await this.administratorService.initAdministrators();
        await this.shippingMethodService.initShippingMethods();
        await this.taxRateService.initTaxRates();
        await this.stockLocationService.initStockLocations();
        await this.eventBus.publish(new initializer_event_1.InitializerEvent());
    }
    /**
     * On the first run of the server & worker, when dbConnectionOptions.synchronize = true, there can be
     * a race condition where the worker starts up before the server process has had a chance to generate
     * the DB schema. This results in a fatal error as the worker is not able to run its initialization
     * tasks which interact with the DB.
     *
     * This method applies retry logic to give the server time to populate the schema before the worker
     * continues with its bootstrap process.
     */
    async awaitDbSchemaGeneration() {
        const retries = 20;
        const delayMs = 100;
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const result = await this.connection.rawConnection.getRepository(administrator_entity_1.Administrator).find();
                return;
            }
            catch (e) {
                if (attempt < retries - 1) {
                    vendure_logger_1.Logger.warn(`Awaiting DB schema creation... (attempt ${attempt})`);
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                }
                else {
                    vendure_logger_1.Logger.error('Timed out when awaiting the DB schema to be ready!', undefined, e.stack);
                }
            }
        }
    }
};
exports.InitializerService = InitializerService;
exports.InitializerService = InitializerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transactional_connection_1.TransactionalConnection,
        zone_service_1.ZoneService,
        channel_service_1.ChannelService,
        role_service_1.RoleService,
        administrator_service_1.AdministratorService,
        shipping_method_service_1.ShippingMethodService,
        global_settings_service_1.GlobalSettingsService,
        tax_rate_service_1.TaxRateService,
        seller_service_1.SellerService,
        event_bus_1.EventBus,
        stock_location_service_1.StockLocationService])
], InitializerService);
//# sourceMappingURL=initializer.service.js.map