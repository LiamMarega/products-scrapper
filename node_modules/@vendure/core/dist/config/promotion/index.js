"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPromotionConditions = exports.defaultPromotionActions = void 0;
const buy_x_get_y_free_action_1 = require("./actions/buy-x-get-y-free-action");
const facet_values_percentage_discount_action_1 = require("./actions/facet-values-percentage-discount-action");
const free_shipping_action_1 = require("./actions/free-shipping-action");
const order_fixed_discount_action_1 = require("./actions/order-fixed-discount-action");
const order_line_fixed_discount_action_1 = require("./actions/order-line-fixed-discount-action");
const order_percentage_discount_action_1 = require("./actions/order-percentage-discount-action");
const product_percentage_discount_action_1 = require("./actions/product-percentage-discount-action");
const buy_x_get_y_free_condition_1 = require("./conditions/buy-x-get-y-free-condition");
const contains_products_condition_1 = require("./conditions/contains-products-condition");
const customer_group_condition_1 = require("./conditions/customer-group-condition");
const has_facet_values_condition_1 = require("./conditions/has-facet-values-condition");
const min_order_amount_condition_1 = require("./conditions/min-order-amount-condition");
__exportStar(require("./promotion-action"), exports);
__exportStar(require("./promotion-condition"), exports);
__exportStar(require("./actions/facet-values-percentage-discount-action"), exports);
__exportStar(require("./actions/order-percentage-discount-action"), exports);
__exportStar(require("./actions/product-percentage-discount-action"), exports);
__exportStar(require("./actions/free-shipping-action"), exports);
__exportStar(require("./actions/buy-x-get-y-free-action"), exports);
__exportStar(require("./actions/order-fixed-discount-action"), exports);
__exportStar(require("./conditions/has-facet-values-condition"), exports);
__exportStar(require("./conditions/min-order-amount-condition"), exports);
__exportStar(require("./conditions/contains-products-condition"), exports);
__exportStar(require("./conditions/customer-group-condition"), exports);
__exportStar(require("./conditions/buy-x-get-y-free-condition"), exports);
exports.defaultPromotionActions = [
    order_fixed_discount_action_1.orderFixedDiscount,
    order_line_fixed_discount_action_1.orderLineFixedDiscount,
    order_percentage_discount_action_1.orderPercentageDiscount,
    facet_values_percentage_discount_action_1.discountOnItemWithFacets,
    product_percentage_discount_action_1.productsPercentageDiscount,
    free_shipping_action_1.freeShipping,
    buy_x_get_y_free_action_1.buyXGetYFreeAction,
];
exports.defaultPromotionConditions = [
    min_order_amount_condition_1.minimumOrderAmount,
    has_facet_values_condition_1.hasFacetValues,
    contains_products_condition_1.containsProducts,
    customer_group_condition_1.customerGroup,
    buy_x_get_y_free_condition_1.buyXGetYFreeCondition,
];
//# sourceMappingURL=index.js.map