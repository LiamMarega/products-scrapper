import { OrderHistoryArgs } from '@vendure/common/lib/generated-types';
import { Order } from '../../../entity/order/order.entity';
import { CustomerService, TranslatorService } from '../../../service/index';
import { HistoryService } from '../../../service/services/history.service';
import { OrderService } from '../../../service/services/order.service';
import { ApiType } from '../../common/get-api-type';
import { RequestContext } from '../../common/request-context';
export declare class OrderEntityResolver {
    private orderService;
    private customerService;
    private historyService;
    private translator;
    constructor(orderService: OrderService, customerService: CustomerService, historyService: HistoryService, translator: TranslatorService);
    payments(ctx: RequestContext, order: Order): Promise<import("../../..").Payment[]>;
    fulfillments(ctx: RequestContext, order: Order): Promise<import("../../..").Fulfillment[]>;
    surcharges(ctx: RequestContext, order: Order): Promise<import("../../..").Surcharge[]>;
    customer(ctx: RequestContext, order: Order): Promise<import("../../..").Customer | undefined>;
    lines(ctx: RequestContext, order: Order): Promise<import("../../..").OrderLine[]>;
    shippingLines(ctx: RequestContext, order: Order): Promise<import("../../..").ShippingLine[]>;
    history(ctx: RequestContext, apiType: ApiType, order: Order, args: OrderHistoryArgs): Promise<import("@vendure/common/lib/shared-types").PaginatedList<import("../../../entity/history-entry/order-history-entry.entity").OrderHistoryEntry>>;
    promotions(ctx: RequestContext, order: Order): Promise<import("../../..").Promotion[]>;
}
export declare class OrderAdminEntityResolver {
    private orderService;
    constructor(orderService: OrderService);
    channels(ctx: RequestContext, order: Order): Promise<import("../../..").Channel[]>;
    modifications(ctx: RequestContext, order: Order): Promise<import("../../../entity/order-modification/order-modification.entity").OrderModification[]>;
    nextStates(order: Order): Promise<readonly import("../../../service/index").OrderState[]>;
    sellerOrders(ctx: RequestContext, order: Order): Promise<Order[]>;
    aggregateOrder(ctx: RequestContext, order: Order): Promise<Order | undefined>;
}
