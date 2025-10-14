import { ShippingLine } from '../../../entity/shipping-line/shipping-line.entity';
import { ShippingMethodService } from '../../../service/services/shipping-method.service';
import { RequestContext } from '../../common/request-context';
export declare class ShippingLineEntityResolver {
    private shippingMethodService;
    constructor(shippingMethodService: ShippingMethodService);
    shippingMethod(ctx: RequestContext, shippingLine: ShippingLine): Promise<import("../../..").Translated<import("../../..").ShippingMethod> | null | undefined>;
}
