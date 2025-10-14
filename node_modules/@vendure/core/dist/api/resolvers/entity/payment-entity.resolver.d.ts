import { RequestContextCacheService } from '../../../cache/request-context-cache.service';
import { PaymentMetadata } from '../../../common/types/common-types';
import { Payment } from '../../../entity/payment/payment.entity';
import { Refund } from '../../../entity/refund/refund.entity';
import { PaymentService } from '../../../service';
import { OrderService } from '../../../service/services/order.service';
import { ApiType } from '../../common/get-api-type';
import { RequestContext } from '../../common/request-context';
export declare class PaymentEntityResolver {
    private orderService;
    private requestContextCache;
    constructor(orderService: OrderService, requestContextCache: RequestContextCacheService);
    refunds(ctx: RequestContext, payment: Payment): Promise<Refund[]>;
    metadata(apiType: ApiType, payment: Payment): PaymentMetadata;
}
export declare class PaymentAdminEntityResolver {
    private paymentService;
    constructor(paymentService: PaymentService);
    nextStates(payment: Payment): Promise<readonly import("../../../service").PaymentState[]>;
}
