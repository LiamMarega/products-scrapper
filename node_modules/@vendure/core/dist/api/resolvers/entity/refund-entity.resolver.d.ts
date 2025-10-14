import { Refund } from '../../../entity/refund/refund.entity';
import { PaymentService } from '../../../service/services/payment.service';
import { RequestContext } from '../../common/request-context';
export declare class RefundEntityResolver {
    private paymentService;
    constructor(paymentService: PaymentService);
    lines(ctx: RequestContext, refund: Refund): Promise<import("../../..").RefundLine[]>;
}
