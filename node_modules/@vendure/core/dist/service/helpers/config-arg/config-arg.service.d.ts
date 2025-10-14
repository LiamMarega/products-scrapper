import { ConfigurableOperation, ConfigurableOperationInput } from '@vendure/common/lib/generated-types';
import { CollectionFilter } from '../../../config/catalog/collection-filter';
import { ConfigService } from '../../../config/config.service';
import { EntityDuplicator } from '../../../config/entity/entity-duplicator';
import { FulfillmentHandler } from '../../../config/fulfillment/fulfillment-handler';
import { PaymentMethodEligibilityChecker } from '../../../config/payment/payment-method-eligibility-checker';
import { PaymentMethodHandler } from '../../../config/payment/payment-method-handler';
import { PromotionAction } from '../../../config/promotion/promotion-action';
import { PromotionCondition } from '../../../config/promotion/promotion-condition';
import { ShippingCalculator } from '../../../config/shipping-method/shipping-calculator';
import { ShippingEligibilityChecker } from '../../../config/shipping-method/shipping-eligibility-checker';
export type ConfigDefTypeMap = {
    CollectionFilter: CollectionFilter;
    EntityDuplicator: EntityDuplicator;
    FulfillmentHandler: FulfillmentHandler;
    PaymentMethodEligibilityChecker: PaymentMethodEligibilityChecker;
    PaymentMethodHandler: PaymentMethodHandler;
    PromotionAction: PromotionAction;
    PromotionCondition: PromotionCondition;
    ShippingCalculator: ShippingCalculator;
    ShippingEligibilityChecker: ShippingEligibilityChecker;
};
export type ConfigDefType = keyof ConfigDefTypeMap;
/**
 * This helper class provides methods relating to ConfigurableOperationDef instances.
 */
export declare class ConfigArgService {
    private configService;
    private readonly definitionsByType;
    constructor(configService: ConfigService);
    getDefinitions<T extends ConfigDefType>(defType: T): Array<ConfigDefTypeMap[T]>;
    getByCode<T extends ConfigDefType>(defType: T, code: string): ConfigDefTypeMap[T];
    /**
     * Parses and validates the input to a ConfigurableOperation.
     */
    parseInput(defType: ConfigDefType, input: ConfigurableOperationInput): ConfigurableOperation;
    private orderArgsToMatchDef;
    private validateRequiredFields;
}
