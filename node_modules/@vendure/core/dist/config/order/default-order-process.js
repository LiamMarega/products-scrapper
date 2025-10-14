"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOrderProcess = void 0;
exports.configureDefaultOrderProcess = configureDefaultOrderProcess;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const unique_1 = require("@vendure/common/lib/unique");
const transactional_connection_1 = require("../../connection/transactional-connection");
const order_entity_1 = require("../../entity/order/order.entity");
const order_line_entity_1 = require("../../entity/order-line/order-line.entity");
const order_modification_entity_1 = require("../../entity/order-modification/order-modification.entity");
const payment_entity_1 = require("../../entity/payment/payment.entity");
const product_variant_entity_1 = require("../../entity/product-variant/product-variant.entity");
const order_placed_event_1 = require("../../event-bus/events/order-placed-event");
const order_utils_1 = require("../../service/helpers/utils/order-utils");
/**
 * @description
 * Used to configure a customized instance of the default {@link OrderProcess} that ships with Vendure.
 * Using this function allows you to turn off certain checks and constraints that are enabled by default.
 *
 * ```ts
 * import { configureDefaultOrderProcess, VendureConfig } from '\@vendure/core';
 *
 * const myCustomOrderProcess = configureDefaultOrderProcess({
 *   // Disable the constraint that requires
 *   // Orders to have a shipping method assigned
 *   // before payment.
 *   arrangingPaymentRequiresShipping: false,
 * });
 *
 * export const config: VendureConfig = {
 *   orderOptions: {
 *     process: [myCustomOrderProcess],
 *   },
 * };
 * ```
 * The {@link DefaultOrderProcessOptions} type defines all available options. If you require even
 * more customization, you can create your own implementation of the {@link OrderProcess} interface.
 *
 *
 * @docsCategory Orders
 * @docsPage OrderProcess
 * @since 2.0.0
 */
function configureDefaultOrderProcess(options) {
    let connection;
    let productVariantService;
    let configService;
    let eventBus;
    let stockMovementService;
    let stockLevelService;
    let historyService;
    let orderSplitter;
    const orderProcess = {
        transitions: {
            Created: {
                to: ['AddingItems', 'Draft'],
            },
            Draft: {
                to: ['Cancelled', 'ArrangingPayment'],
            },
            AddingItems: {
                to: ['ArrangingPayment', 'Cancelled'],
            },
            ArrangingPayment: {
                to: ['PaymentAuthorized', 'PaymentSettled', 'AddingItems', 'Cancelled'],
            },
            PaymentAuthorized: {
                to: ['PaymentSettled', 'Cancelled', 'Modifying', 'ArrangingAdditionalPayment'],
            },
            PaymentSettled: {
                to: [
                    'PartiallyDelivered',
                    'Delivered',
                    'PartiallyShipped',
                    'Shipped',
                    'Cancelled',
                    'Modifying',
                    'ArrangingAdditionalPayment',
                ],
            },
            PartiallyShipped: {
                to: ['Shipped', 'PartiallyDelivered', 'Cancelled', 'Modifying'],
            },
            Shipped: {
                to: ['PartiallyDelivered', 'Delivered', 'Cancelled', 'Modifying'],
            },
            PartiallyDelivered: {
                to: ['Delivered', 'Cancelled', 'Modifying'],
            },
            Delivered: {
                to: ['Cancelled'],
            },
            Modifying: {
                to: [
                    'PaymentAuthorized',
                    'PaymentSettled',
                    'PartiallyShipped',
                    'Shipped',
                    'PartiallyDelivered',
                    'ArrangingAdditionalPayment',
                ],
            },
            ArrangingAdditionalPayment: {
                to: [
                    'PaymentAuthorized',
                    'PaymentSettled',
                    'PartiallyShipped',
                    'Shipped',
                    'PartiallyDelivered',
                    'Cancelled',
                ],
            },
            Cancelled: {
                to: [],
            },
        },
        async init(injector) {
            // Lazily import these services to avoid a circular dependency error
            // due to this being used as part of the DefaultConfig
            const ConfigService = await import('../config.service.js').then(m => m.ConfigService);
            const EventBus = await import('../../event-bus/index.js').then(m => m.EventBus);
            const StockMovementService = await import('../../service/index.js').then(m => m.StockMovementService);
            const StockLevelService = await import('../../service/index.js').then(m => m.StockLevelService);
            const HistoryService = await import('../../service/index.js').then(m => m.HistoryService);
            const OrderSplitter = await import('../../service/index.js').then(m => m.OrderSplitter);
            const ProductVariantService = await import('../../service/index.js').then(m => m.ProductVariantService);
            connection = injector.get(transactional_connection_1.TransactionalConnection);
            productVariantService = injector.get(ProductVariantService);
            configService = injector.get(ConfigService);
            eventBus = injector.get(EventBus);
            stockMovementService = injector.get(StockMovementService);
            stockLevelService = injector.get(StockLevelService);
            historyService = injector.get(HistoryService);
            orderSplitter = injector.get(OrderSplitter);
        },
        async onTransitionStart(fromState, toState, { ctx, order }) {
            if (options.checkModificationPayments !== false && fromState === 'Modifying') {
                const modifications = await connection
                    .getRepository(ctx, order_modification_entity_1.OrderModification)
                    .find({ where: { order: { id: order.id } }, relations: ['refund', 'payment'] });
                if (toState === 'ArrangingAdditionalPayment') {
                    if (0 < modifications.length &&
                        modifications.every(modification => modification.isSettled)) {
                        return 'message.cannot-transition-no-additional-payments-needed';
                    }
                }
                else {
                    if (modifications.some(modification => !modification.isSettled)) {
                        return 'message.cannot-transition-without-modification-payment';
                    }
                }
            }
            if (options.checkAdditionalPaymentsAmount !== false &&
                fromState === 'ArrangingAdditionalPayment') {
                if (toState === 'Cancelled') {
                    return;
                }
                const existingPayments = await connection.getRepository(ctx, payment_entity_1.Payment).find({
                    relations: ['refunds'],
                    where: {
                        order: { id: order.id },
                    },
                });
                order.payments = existingPayments;
                const deficit = order.totalWithTax - (0, order_utils_1.totalCoveredByPayments)(order);
                if (0 < deficit) {
                    return 'message.cannot-transition-from-arranging-additional-payment';
                }
            }
            if (options.checkAllVariantsExist !== false &&
                fromState === 'AddingItems' &&
                toState !== 'Cancelled' &&
                order.lines.length > 0) {
                const variantIds = (0, unique_1.unique)(order.lines.map(l => l.productVariant.id));
                const qb = connection
                    .getRepository(ctx, product_variant_entity_1.ProductVariant)
                    .createQueryBuilder('variant')
                    .leftJoin('variant.product', 'product')
                    .where('variant.deletedAt IS NULL')
                    .andWhere('product.deletedAt IS NULL')
                    .andWhere('variant.id IN (:...variantIds)', { variantIds });
                const availableVariants = await qb.getMany();
                if (availableVariants.length !== variantIds.length) {
                    return 'message.cannot-transition-order-contains-products-which-are-unavailable';
                }
            }
            if (toState === 'ArrangingPayment') {
                if (options.arrangingPaymentRequiresContents !== false && order.lines.length === 0) {
                    return 'message.cannot-transition-to-payment-when-order-is-empty';
                }
                if (options.arrangingPaymentRequiresCustomer !== false && !order.customer) {
                    return 'message.cannot-transition-to-payment-without-customer';
                }
                if (options.arrangingPaymentRequiresShipping !== false &&
                    (!order.shippingLines || order.shippingLines.length === 0)) {
                    return 'message.cannot-transition-to-payment-without-shipping-method';
                }
                if (options.arrangingPaymentRequiresStock !== false) {
                    const variantsWithInsufficientSaleableStock = [];
                    for (const line of order.lines) {
                        const availableStock = await productVariantService.getSaleableStockLevel(ctx, line.productVariant);
                        if (line.quantity > availableStock) {
                            variantsWithInsufficientSaleableStock.push(line.productVariant);
                        }
                    }
                    if (variantsWithInsufficientSaleableStock.length) {
                        return ctx.translate('message.cannot-transition-to-payment-due-to-insufficient-stock', {
                            productVariantNames: variantsWithInsufficientSaleableStock
                                .map(v => v.name)
                                .join(', '),
                        });
                    }
                }
            }
            if (options.checkPaymentsCoverTotal !== false) {
                if (toState === 'PaymentAuthorized') {
                    const hasAnAuthorizedPayment = !!order.payments.find(p => p.state === 'Authorized');
                    if (!(0, order_utils_1.orderTotalIsCovered)(order, ['Authorized', 'Settled']) || !hasAnAuthorizedPayment) {
                        return 'message.cannot-transition-without-authorized-payments';
                    }
                }
                if (toState === 'PaymentSettled' && !(0, order_utils_1.orderTotalIsCovered)(order, 'Settled')) {
                    return 'message.cannot-transition-without-settled-payments';
                }
            }
            if (options.checkAllItemsBeforeCancel !== false) {
                if (toState === 'Cancelled' &&
                    fromState !== 'AddingItems' &&
                    fromState !== 'ArrangingPayment') {
                    if (!(0, order_utils_1.orderLinesAreAllCancelled)(order)) {
                        return 'message.cannot-transition-unless-all-cancelled';
                    }
                }
            }
            if (options.checkFulfillmentStates !== false) {
                if (toState === 'PartiallyShipped') {
                    const orderWithFulfillments = await findOrderWithFulfillments(ctx, order.id);
                    if (!(0, order_utils_1.orderItemsArePartiallyShipped)(orderWithFulfillments)) {
                        return 'message.cannot-transition-unless-some-order-items-shipped';
                    }
                }
                if (toState === 'Shipped') {
                    const orderWithFulfillments = await findOrderWithFulfillments(ctx, order.id);
                    if (!(0, order_utils_1.orderItemsAreShipped)(orderWithFulfillments)) {
                        return 'message.cannot-transition-unless-all-order-items-shipped';
                    }
                }
                if (toState === 'PartiallyDelivered') {
                    const orderWithFulfillments = await findOrderWithFulfillments(ctx, order.id);
                    if (!(0, order_utils_1.orderItemsArePartiallyDelivered)(orderWithFulfillments)) {
                        return 'message.cannot-transition-unless-some-order-items-delivered';
                    }
                }
                if (toState === 'Delivered') {
                    const orderWithFulfillments = await findOrderWithFulfillments(ctx, order.id);
                    if (!(0, order_utils_1.orderItemsAreDelivered)(orderWithFulfillments)) {
                        return 'message.cannot-transition-unless-all-order-items-delivered';
                    }
                }
            }
        },
        async onTransitionEnd(fromState, toState, data) {
            const { ctx, order } = data;
            const { stockAllocationStrategy, orderPlacedStrategy } = configService.orderOptions;
            if (order.active) {
                const shouldSetAsPlaced = orderPlacedStrategy.shouldSetAsPlaced(ctx, fromState, toState, order);
                if (shouldSetAsPlaced) {
                    order.active = false;
                    order.orderPlacedAt = new Date();
                    await Promise.all(order.lines.map(line => {
                        line.orderPlacedQuantity = line.quantity;
                        return connection
                            .getRepository(ctx, order_line_entity_1.OrderLine)
                            .update(line.id, { orderPlacedQuantity: line.quantity });
                    }));
                    await eventBus.publish(new order_placed_event_1.OrderPlacedEvent(fromState, toState, ctx, order));
                    await orderSplitter.createSellerOrders(ctx, order);
                }
            }
            const shouldAllocateStock = await stockAllocationStrategy.shouldAllocateStock(ctx, fromState, toState, order);
            if (shouldAllocateStock) {
                await stockMovementService.createAllocationsForOrder(ctx, order);
            }
            if (toState === 'Cancelled') {
                order.active = false;
            }
            if (fromState === 'Draft' && toState === 'ArrangingPayment') {
                // Once we exit the Draft state, we can consider the order active,
                // which will allow us to run the OrderPlacedStrategy at the correct point.
                order.active = true;
            }
            await historyService.createHistoryEntryForOrder({
                orderId: order.id,
                type: generated_types_1.HistoryEntryType.ORDER_STATE_TRANSITION,
                ctx,
                data: {
                    from: fromState,
                    to: toState,
                },
            });
        },
    };
    async function findOrderWithFulfillments(ctx, id) {
        return await connection.getEntityOrThrow(ctx, order_entity_1.Order, id, {
            relations: ['lines', 'fulfillments', 'fulfillments.lines', 'fulfillments.lines.fulfillment'],
        });
    }
    return orderProcess;
}
/**
 * @description
 * This is the built-in {@link OrderProcess} that ships with Vendure. A customized version of this process
 * can be created using the {@link configureDefaultOrderProcess} function, which allows you to pass in an object
 * to enable/disable certain checks.
 *
 * @docsCategory Orders
 * @docsPage OrderProcess
 * @since 2.0.0
 */
exports.defaultOrderProcess = configureDefaultOrderProcess({});
//# sourceMappingURL=default-order-process.js.map