"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderTotalIsCovered = orderTotalIsCovered;
exports.totalCoveredByPayments = totalCoveredByPayments;
exports.orderItemsAreDelivered = orderItemsAreDelivered;
exports.orderItemsArePartiallyDelivered = orderItemsArePartiallyDelivered;
exports.orderItemsArePartiallyShipped = orderItemsArePartiallyShipped;
exports.orderItemsAreShipped = orderItemsAreShipped;
exports.orderLinesAreAllCancelled = orderLinesAreAllCancelled;
exports.getOrdersFromLines = getOrdersFromLines;
const shared_utils_1 = require("@vendure/common/lib/shared-utils");
const unique_1 = require("@vendure/common/lib/unique");
const typeorm_1 = require("typeorm");
const errors_1 = require("../../../common/error/errors");
const utils_1 = require("../../../common/utils");
const order_line_entity_1 = require("../../../entity/order-line/order-line.entity");
/**
 * Returns true if the Order total is covered by Payments in the specified state.
 */
function orderTotalIsCovered(order, state) {
    const paymentsTotal = totalCoveredByPayments(order, state);
    return paymentsTotal >= order.totalWithTax;
}
/**
 * Returns the total amount covered by all Payments (minus any refunds)
 */
function totalCoveredByPayments(order, state) {
    var _a, _b;
    const payments = state
        ? Array.isArray(state)
            ? order.payments.filter(p => state.includes(p.state))
            : order.payments.filter(p => p.state === state)
        : order.payments.filter(p => p.state !== 'Error' && p.state !== 'Declined' && p.state !== 'Cancelled');
    let total = 0;
    for (const payment of payments) {
        const settledRefunds = (_b = (_a = payment.refunds) === null || _a === void 0 ? void 0 : _a.filter(refund => refund.state === 'Settled')) !== null && _b !== void 0 ? _b : [];
        const settledRefundTotal = (0, shared_utils_1.summate)(settledRefunds, 'total');
        total += payment.amount - Math.abs(settledRefundTotal);
    }
    return total;
}
/**
 * Returns true if all (non-cancelled) OrderItems are delivered.
 */
function orderItemsAreDelivered(order) {
    return (getOrderLinesFulfillmentStates(order).every(state => state === 'Delivered') &&
        !isOrderPartiallyFulfilled(order));
}
/**
 * Returns true if at least one, but not all (non-cancelled) OrderItems are delivered.
 */
function orderItemsArePartiallyDelivered(order) {
    const states = getOrderLinesFulfillmentStates(order);
    return (states.some(state => state === 'Delivered') &&
        (!states.every(state => state === 'Delivered') || isOrderPartiallyFulfilled(order)));
}
function getOrderLinesFulfillmentStates(order) {
    const fulfillmentLines = getOrderFulfillmentLines(order);
    const states = (0, unique_1.unique)(order.lines
        .filter(line => line.quantity !== 0)
        .map(line => {
        const matchingFulfillmentLines = fulfillmentLines.filter(fl => (0, utils_1.idsAreEqual)(fl.orderLineId, line.id));
        const totalFulfilled = (0, shared_utils_1.summate)(matchingFulfillmentLines, 'quantity');
        if (0 < totalFulfilled) {
            return matchingFulfillmentLines.map(l => l.fulfillment.state);
        }
        else {
            return undefined;
        }
    })
        .flat());
    return states;
}
/**
 * Returns true if at least one, but not all (non-cancelled) OrderItems are shipped.
 */
function orderItemsArePartiallyShipped(order) {
    const states = getOrderLinesFulfillmentStates(order);
    return (states.some(state => state === 'Shipped') &&
        (!states.every(state => state === 'Shipped') || isOrderPartiallyFulfilled(order)));
}
/**
 * Returns true if all (non-cancelled) OrderItems are shipped.
 */
function orderItemsAreShipped(order) {
    return (getOrderLinesFulfillmentStates(order).every(state => state === 'Shipped') &&
        !isOrderPartiallyFulfilled(order));
}
/**
 * Returns true if all OrderItems in the order are cancelled
 */
function orderLinesAreAllCancelled(order) {
    return order.lines.every(line => line.quantity === 0);
}
function getOrderFulfillmentLines(order) {
    return order.fulfillments
        .filter(f => f.state !== 'Cancelled')
        .reduce((fulfillmentLines, fulfillment) => [...fulfillmentLines, ...fulfillment.lines], []);
}
/**
 * Returns true if Fulfillments exist for only some but not all of the
 * order items.
 */
function isOrderPartiallyFulfilled(order) {
    const fulfillmentLines = getOrderFulfillmentLines(order);
    const lines = fulfillmentLines.reduce((acc, item) => {
        acc[item.orderLineId] = (acc[item.orderLineId] || 0) + item.quantity;
        return acc;
    }, {});
    return order.lines.some(line => line.quantity > lines[line.id]);
}
async function getOrdersFromLines(ctx, connection, orderLinesInput) {
    const orders = new Map();
    const lines = await connection.getRepository(ctx, order_line_entity_1.OrderLine).find({
        where: { id: (0, typeorm_1.In)(orderLinesInput.map(l => l.orderLineId)) },
        relations: ['order', 'order.channels'],
        order: { id: 'ASC' },
    });
    for (const line of lines) {
        const inputLine = orderLinesInput.find(l => (0, utils_1.idsAreEqual)(l.orderLineId, line.id));
        if (!inputLine) {
            continue;
        }
        const order = line.order;
        if (!order.channels.some(channel => channel.id === ctx.channelId)) {
            throw new errors_1.EntityNotFoundError('Order', order.id);
        }
        if (!orders.has(order.id)) {
            orders.set(order.id, order);
        }
    }
    return Array.from(orders.values());
}
//# sourceMappingURL=order-utils.js.map