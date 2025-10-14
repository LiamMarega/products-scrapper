import { ShippingMethod } from '../../../entity/shipping-method/shipping-method.entity';
import { ShippingMethodService } from '../../../service/services/shipping-method.service';
import { RequestContext } from '../../common/request-context';
export declare class ShopShippingMethodsResolver {
    readonly shippingMethodService: ShippingMethodService;
    constructor(shippingMethodService: ShippingMethodService);
    activeShippingMethods(ctx: RequestContext): Promise<ShippingMethod[]>;
}
