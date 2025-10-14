"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Promotion = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const typeorm_1 = require("typeorm");
const round_money_1 = require("../../common/round-money");
const adjustment_source_1 = require("../../common/types/adjustment-source");
const config_helpers_1 = require("../../config/config-helpers");
const promotion_action_1 = require("../../config/promotion/promotion-action");
const channel_entity_1 = require("../channel/channel.entity");
const custom_entity_fields_1 = require("../custom-entity-fields");
const order_entity_1 = require("../order/order.entity");
const promotion_translation_entity_1 = require("./promotion-translation.entity");
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
let Promotion = class Promotion extends adjustment_source_1.AdjustmentSource {
    constructor(input) {
        super(input);
        this.type = generated_types_1.AdjustmentType.PROMOTION;
        this.allConditions = {};
        this.allActions = {};
        const conditions = (input && input.promotionConditions) || (0, config_helpers_1.getConfig)().promotionOptions.promotionConditions || [];
        const actions = (input && input.promotionActions) || (0, config_helpers_1.getConfig)().promotionOptions.promotionActions || [];
        this.allConditions = conditions.reduce((hash, o) => (Object.assign(Object.assign({}, hash), { [o.code]: o })), {});
        this.allActions = actions.reduce((hash, o) => (Object.assign(Object.assign({}, hash), { [o.code]: o })), {});
    }
    async apply(ctx, args, state) {
        let amount = 0;
        state = state || {};
        for (const action of this.actions) {
            const promotionAction = this.allActions[action.code];
            if (promotionAction instanceof promotion_action_1.PromotionItemAction) {
                if (this.isOrderItemArg(args)) {
                    const { orderLine } = args;
                    amount += (0, round_money_1.roundMoney)(await promotionAction.execute(ctx, orderLine, action.args, state, this), orderLine.quantity);
                }
            }
            else if (promotionAction instanceof promotion_action_1.PromotionLineAction) {
                if (this.isOrderLineArg(args)) {
                    const { orderLine } = args;
                    amount += (0, round_money_1.roundMoney)(await promotionAction.execute(ctx, orderLine, action.args, state, this));
                }
            }
            else if (promotionAction instanceof promotion_action_1.PromotionOrderAction) {
                if (this.isOrderArg(args)) {
                    const { order } = args;
                    amount += (0, round_money_1.roundMoney)(await promotionAction.execute(ctx, order, action.args, state, this));
                }
            }
            else if (promotionAction instanceof promotion_action_1.PromotionShippingAction) {
                if (this.isShippingArg(args)) {
                    const { shippingLine, order } = args;
                    amount += (0, round_money_1.roundMoney)(await promotionAction.execute(ctx, shippingLine, order, action.args, state, this));
                }
            }
        }
        if (amount !== 0) {
            return {
                amount,
                type: this.type,
                description: this.name,
                adjustmentSource: this.getSourceId(),
                data: {},
            };
        }
    }
    async test(ctx, order) {
        if (this.endsAt && this.endsAt < new Date()) {
            return false;
        }
        if (this.startsAt && this.startsAt > new Date()) {
            return false;
        }
        if (this.couponCode && !order.couponCodes.includes(this.couponCode)) {
            return false;
        }
        const promotionState = {};
        for (const condition of this.conditions) {
            const promotionCondition = this.allConditions[condition.code];
            if (!promotionCondition) {
                return false;
            }
            const applicableOrConditionState = await promotionCondition.check(ctx, order, condition.args, this);
            if (!applicableOrConditionState) {
                return false;
            }
            if (typeof applicableOrConditionState === 'object') {
                promotionState[condition.code] = applicableOrConditionState;
            }
        }
        return promotionState;
    }
    async activate(ctx, order) {
        for (const action of this.actions) {
            const promotionAction = this.allActions[action.code];
            await promotionAction.onActivate(ctx, order, action.args, this);
        }
    }
    async deactivate(ctx, order) {
        for (const action of this.actions) {
            const promotionAction = this.allActions[action.code];
            await promotionAction.onDeactivate(ctx, order, action.args, this);
        }
    }
    isShippingAction(value) {
        return value instanceof promotion_action_1.PromotionShippingAction;
    }
    isOrderArg(value) {
        return !this.isOrderItemArg(value) && !this.isShippingArg(value);
    }
    isOrderLineArg(value) {
        return value.hasOwnProperty('orderLine');
    }
    isOrderItemArg(value) {
        return value.hasOwnProperty('orderLine');
    }
    isShippingArg(value) {
        return value.hasOwnProperty('shippingLine');
    }
};
exports.Promotion = Promotion;
__decorate([
    (0, typeorm_1.Column)({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], Promotion.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], Promotion.prototype, "startsAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], Promotion.prototype, "endsAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Promotion.prototype, "couponCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Promotion.prototype, "perCustomerUsageLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Promotion.prototype, "usageLimit", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => promotion_translation_entity_1.PromotionTranslation, translation => translation.base, { eager: true }),
    __metadata("design:type", Array)
], Promotion.prototype, "translations", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Promotion.prototype, "enabled", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => channel_entity_1.Channel, channel => channel.promotions),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Promotion.prototype, "channels", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => order_entity_1.Order, order => order.promotions),
    __metadata("design:type", Array)
], Promotion.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.Column)(type => custom_entity_fields_1.CustomPromotionFields),
    __metadata("design:type", custom_entity_fields_1.CustomPromotionFields)
], Promotion.prototype, "customFields", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json'),
    __metadata("design:type", Array)
], Promotion.prototype, "conditions", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json'),
    __metadata("design:type", Array)
], Promotion.prototype, "actions", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Promotion.prototype, "priorityScore", void 0);
exports.Promotion = Promotion = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Promotion);
//# sourceMappingURL=promotion.entity.js.map