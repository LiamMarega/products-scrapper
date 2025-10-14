import { PaymentMethod } from '../../../entity/payment-method/payment-method.entity';
import { PaymentMethodService } from '../../../service/services/payment-method.service';
import { RequestContext } from '../../common/request-context';
export declare class ShopPaymentMethodsResolver {
    readonly paymentMethodService: PaymentMethodService;
    constructor(paymentMethodService: PaymentMethodService);
    activePaymentMethods(ctx: RequestContext): Promise<PaymentMethod[]>;
}
