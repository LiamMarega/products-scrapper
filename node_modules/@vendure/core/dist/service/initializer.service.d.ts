import { TransactionalConnection } from '../connection/transactional-connection';
import { EventBus } from '../event-bus';
import { AdministratorService } from './services/administrator.service';
import { ChannelService } from './services/channel.service';
import { GlobalSettingsService } from './services/global-settings.service';
import { RoleService } from './services/role.service';
import { SellerService } from './services/seller.service';
import { ShippingMethodService } from './services/shipping-method.service';
import { StockLocationService } from './services/stock-location.service';
import { TaxRateService } from './services/tax-rate.service';
import { ZoneService } from './services/zone.service';
/**
 * @description
 * Only used internally to run the various service init methods in the correct
 * sequence on bootstrap.
 *
 * @docsCategory services
 */
export declare class InitializerService {
    private connection;
    private zoneService;
    private channelService;
    private roleService;
    private administratorService;
    private shippingMethodService;
    private globalSettingsService;
    private taxRateService;
    private sellerService;
    private eventBus;
    private stockLocationService;
    constructor(connection: TransactionalConnection, zoneService: ZoneService, channelService: ChannelService, roleService: RoleService, administratorService: AdministratorService, shippingMethodService: ShippingMethodService, globalSettingsService: GlobalSettingsService, taxRateService: TaxRateService, sellerService: SellerService, eventBus: EventBus, stockLocationService: StockLocationService);
    onModuleInit(): Promise<void>;
    /**
     * On the first run of the server & worker, when dbConnectionOptions.synchronize = true, there can be
     * a race condition where the worker starts up before the server process has had a chance to generate
     * the DB schema. This results in a fatal error as the worker is not able to run its initialization
     * tasks which interact with the DB.
     *
     * This method applies retry logic to give the server time to populate the schema before the worker
     * continues with its bootstrap process.
     */
    private awaitDbSchemaGeneration;
}
