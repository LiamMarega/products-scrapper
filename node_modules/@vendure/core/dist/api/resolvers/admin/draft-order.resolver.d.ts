import { ActiveOrderResult, ApplyCouponCodeResult, RemoveOrderItemsResult, SetOrderShippingMethodResult, UpdateOrderItemsResult } from '@vendure/common/lib/generated-shop-types';
import { DeletionResponse, MutationAddItemToDraftOrderArgs, MutationAdjustDraftOrderLineArgs, MutationApplyCouponCodeToDraftOrderArgs, MutationDeleteDraftOrderArgs, MutationRemoveCouponCodeFromDraftOrderArgs, MutationRemoveDraftOrderLineArgs, MutationSetCustomerForDraftOrderArgs, MutationSetDraftOrderBillingAddressArgs, MutationSetDraftOrderCustomFieldsArgs, MutationSetDraftOrderShippingAddressArgs, MutationSetDraftOrderShippingMethodArgs, MutationUnsetDraftOrderBillingAddressArgs, MutationUnsetDraftOrderShippingAddressArgs, QueryEligibleShippingMethodsForDraftOrderArgs, ShippingMethodQuote } from '@vendure/common/lib/generated-types';
import { ErrorResultUnion } from '../../../common/error/error-result';
import { TransactionalConnection } from '../../../connection/index';
import { Order } from '../../../entity/order/order.entity';
import { CustomerService } from '../../../service/services/customer.service';
import { OrderService } from '../../../service/services/order.service';
import { RequestContext } from '../../common/request-context';
export declare class DraftOrderResolver {
    private orderService;
    private customerService;
    private connection;
    constructor(orderService: OrderService, customerService: CustomerService, connection: TransactionalConnection);
    createDraftOrder(ctx: RequestContext): Promise<Order>;
    deleteDraftOrder(ctx: RequestContext, args: MutationDeleteDraftOrderArgs): Promise<DeletionResponse>;
    addItemToDraftOrder(ctx: RequestContext, { orderId, input }: MutationAddItemToDraftOrderArgs): Promise<ErrorResultUnion<UpdateOrderItemsResult, Order>>;
    adjustDraftOrderLine(ctx: RequestContext, { orderId, input }: MutationAdjustDraftOrderLineArgs): Promise<ErrorResultUnion<UpdateOrderItemsResult, Order>>;
    removeDraftOrderLine(ctx: RequestContext, args: MutationRemoveDraftOrderLineArgs): Promise<ErrorResultUnion<RemoveOrderItemsResult, Order>>;
    setDraftOrderCustomFields(ctx: RequestContext, args: MutationSetDraftOrderCustomFieldsArgs): Promise<ErrorResultUnion<RemoveOrderItemsResult, Order>>;
    setCustomerForDraftOrder(ctx: RequestContext, args: MutationSetCustomerForDraftOrderArgs): Promise<ErrorResultUnion</* SetCustomerForDraftOrderResult*/ any, Order>>;
    setDraftOrderShippingAddress(ctx: RequestContext, args: MutationSetDraftOrderShippingAddressArgs): Promise<Order>;
    setDraftOrderBillingAddress(ctx: RequestContext, args: MutationSetDraftOrderBillingAddressArgs): Promise<ErrorResultUnion<ActiveOrderResult, Order>>;
    unsetDraftOrderShippingAddress(ctx: RequestContext, args: MutationUnsetDraftOrderShippingAddressArgs): Promise<ErrorResultUnion<ActiveOrderResult, Order>>;
    unsetDraftOrderBillingAddress(ctx: RequestContext, args: MutationUnsetDraftOrderBillingAddressArgs): Promise<ErrorResultUnion<ActiveOrderResult, Order>>;
    applyCouponCodeToDraftOrder(ctx: RequestContext, args: MutationApplyCouponCodeToDraftOrderArgs): Promise<ErrorResultUnion<ApplyCouponCodeResult, Order>>;
    removeCouponCodeFromDraftOrder(ctx: RequestContext, args: MutationRemoveCouponCodeFromDraftOrderArgs): Promise<Order>;
    eligibleShippingMethodsForDraftOrder(ctx: RequestContext, args: QueryEligibleShippingMethodsForDraftOrderArgs): Promise<ShippingMethodQuote[]>;
    setDraftOrderShippingMethod(ctx: RequestContext, args: MutationSetDraftOrderShippingMethodArgs): Promise<ErrorResultUnion<SetOrderShippingMethodResult, Order>>;
}
