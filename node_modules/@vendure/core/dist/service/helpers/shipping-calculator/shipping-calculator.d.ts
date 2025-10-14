import { ID } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../../api/common/request-context';
import { ShippingCalculationResult } from '../../../config/shipping-method/shipping-calculator';
import { Order } from '../../../entity/order/order.entity';
import { ShippingMethod } from '../../../entity/shipping-method/shipping-method.entity';
import { ShippingMethodService } from '../../services/shipping-method.service';
type EligibleShippingMethod = {
    method: ShippingMethod;
    result: ShippingCalculationResult;
};
export declare class ShippingCalculator {
    private shippingMethodService;
    constructor(shippingMethodService: ShippingMethodService);
    /**
     * Returns an array of each eligible ShippingMethod for the given Order and sorts them by
     * price, with the cheapest first.
     *
     * The `skipIds` argument is used to skip ShippingMethods with those IDs from being checked and calculated.
     */
    getEligibleShippingMethods(ctx: RequestContext, order: Order, skipIds?: ID[]): Promise<EligibleShippingMethod[]>;
    getMethodIfEligible(ctx: RequestContext, order: Order, shippingMethodId: ID): Promise<ShippingMethod | undefined>;
    private checkEligibilityByShippingMethod;
}
export {};
