import { ShippingMethodQuote, TestEligibleShippingMethodsInput, TestShippingMethodInput, TestShippingMethodResult } from '@vendure/common/lib/generated-types';
import { RequestContext } from '../../api/common/request-context';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { ConfigArgService } from '../helpers/config-arg/config-arg.service';
import { OrderCalculator } from '../helpers/order-calculator/order-calculator';
import { ProductPriceApplicator } from '../helpers/product-price-applicator/product-price-applicator';
import { ShippingCalculator } from '../helpers/shipping-calculator/shipping-calculator';
import { TranslatorService } from '../helpers/translator/translator.service';
/**
 * @description
 * This service is responsible for creating temporary mock Orders against which tests can be run, such as
 * testing a ShippingMethod or Promotion.
 *
 * @docsCategory services
 */
export declare class OrderTestingService {
    private connection;
    private orderCalculator;
    private shippingCalculator;
    private configArgService;
    private configService;
    private productPriceApplicator;
    private translator;
    constructor(connection: TransactionalConnection, orderCalculator: OrderCalculator, shippingCalculator: ShippingCalculator, configArgService: ConfigArgService, configService: ConfigService, productPriceApplicator: ProductPriceApplicator, translator: TranslatorService);
    /**
     * @description
     * Runs a given ShippingMethod configuration against a mock Order to test for eligibility and resulting
     * price.
     */
    testShippingMethod(ctx: RequestContext, input: TestShippingMethodInput): Promise<TestShippingMethodResult>;
    /**
     * @description
     * Tests all available ShippingMethods against a mock Order and return those which are eligible. This
     * is intended to simulate a call to the `eligibleShippingMethods` query of the Shop API.
     */
    testEligibleShippingMethods(ctx: RequestContext, input: TestEligibleShippingMethodsInput): Promise<ShippingMethodQuote[]>;
    private buildMockOrder;
}
