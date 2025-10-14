import { Adjustment, AdjustmentType, ConfigurableOperation } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { AdjustmentSource } from '../../common/types/adjustment-source';
import { ChannelAware, SoftDeletable } from '../../common/types/common-types';
import { LocaleString, Translatable, Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { PromotionAction } from '../../config/promotion/promotion-action';
import { PromotionCondition, PromotionConditionState } from '../../config/promotion/promotion-condition';
import { Channel } from '../channel/channel.entity';
import { CustomPromotionFields } from '../custom-entity-fields';
import { Order } from '../order/order.entity';
import { OrderLine } from '../order-line/order-line.entity';
import { ShippingLine } from '../shipping-line/shipping-line.entity';
export interface ApplyOrderItemActionArgs {
    orderLine: OrderLine;
}
export interface ApplyOrderLineActionArgs {
    orderLine: OrderLine;
}
export interface ApplyOrderActionArgs {
    order: Order;
}
export interface ApplyShippingActionArgs {
    shippingLine: ShippingLine;
    order: Order;
}
export interface PromotionState {
    [code: string]: PromotionConditionState;
}
export type PromotionTestResult = boolean | PromotionState;
/**
 * @description
 * A Promotion is used to define a set of conditions under which promotions actions (typically discounts)
 * will be applied to an Order.
 *
 * Each assigned {@link PromotionCondition} is checked against the Order, and if they all return `true`,
 * then each assign {@link PromotionItemAction} / {@link PromotionLineAction} / {@link PromotionOrderAction} / {@link PromotionShippingAction} is applied to the Order.
 *
 * @docsCategory entities
 */
export declare class Promotion extends AdjustmentSource implements ChannelAware, SoftDeletable, HasCustomFields, Translatable {
    type: AdjustmentType;
    private readonly allConditions;
    private readonly allActions;
    constructor(input?: DeepPartial<Promotion> & {
        promotionConditions?: Array<PromotionCondition<any>>;
        promotionActions?: Array<PromotionAction<any>>;
    });
    deletedAt: Date | null;
    startsAt: Date | null;
    endsAt: Date | null;
    couponCode: string;
    perCustomerUsageLimit: number;
    usageLimit: number;
    name: LocaleString;
    description: LocaleString;
    translations: Array<Translation<Promotion>>;
    enabled: boolean;
    channels: Channel[];
    orders: Order[];
    customFields: CustomPromotionFields;
    conditions: ConfigurableOperation[];
    actions: ConfigurableOperation[];
    /**
     * @description
     * The PriorityScore is used to determine the sequence in which multiple promotions are tested
     * on a given order. A higher number moves the Promotion towards the end of the sequence.
     *
     * The score is derived from the sum of the priorityValues of the PromotionConditions and
     * PromotionActions comprising this Promotion.
     *
     * An example illustrating the need for a priority is this:
     *
     *
     * Consider 2 Promotions, 1) buy 1 get one free and 2) 10% off when order total is over $50.
     * If Promotion 2 is evaluated prior to Promotion 1, then it can trigger the 10% discount even
     * if the subsequent application of Promotion 1 brings the order total down to way below $50.
     */
    priorityScore: number;
    apply(ctx: RequestContext, args: ApplyOrderActionArgs | ApplyOrderItemActionArgs | ApplyShippingActionArgs, state?: PromotionState): Promise<Adjustment | undefined>;
    test(ctx: RequestContext, order: Order): Promise<PromotionTestResult>;
    activate(ctx: RequestContext, order: Order): Promise<void>;
    deactivate(ctx: RequestContext, order: Order): Promise<void>;
    private isShippingAction;
    private isOrderArg;
    private isOrderLineArg;
    private isOrderItemArg;
    private isShippingArg;
}
