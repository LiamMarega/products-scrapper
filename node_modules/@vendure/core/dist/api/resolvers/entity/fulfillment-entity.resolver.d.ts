import { RequestContextCacheService } from '../../../cache/request-context-cache.service';
import { Fulfillment } from '../../../entity/fulfillment/fulfillment.entity';
import { FulfillmentService } from '../../../service/services/fulfillment.service';
import { RequestContext } from '../../common/request-context';
export declare class FulfillmentEntityResolver {
    private fulfillmentService;
    private requestContextCache;
    constructor(fulfillmentService: FulfillmentService, requestContextCache: RequestContextCacheService);
    lines(ctx: RequestContext, fulfillment: Fulfillment): Promise<import("../../..").FulfillmentLine[]>;
    summary(ctx: RequestContext, fulfillment: Fulfillment): Promise<import("../../..").FulfillmentLine[]>;
}
export declare class FulfillmentAdminEntityResolver {
    private fulfillmentService;
    constructor(fulfillmentService: FulfillmentService);
    nextStates(fulfillment: Fulfillment): Promise<readonly import("../../..").FulfillmentState[]>;
}
