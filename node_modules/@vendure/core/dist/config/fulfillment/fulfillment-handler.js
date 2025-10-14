"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FulfillmentHandler = void 0;
const configurable_operation_1 = require("../../common/configurable-operation");
/**
 * @description
 * A FulfillmentHandler is used when creating a new {@link Fulfillment}. When the `addFulfillmentToOrder` mutation
 * is executed, the specified handler will be used and it's `createFulfillment` method is called. This method
 * may perform async tasks such as calling a 3rd-party shipping API to register a new shipment and receive
 * a tracking code. This data can then be returned and will be incorporated into the created Fulfillment.
 *
 * If the `args` property is defined, this means that arguments passed to the `addFulfillmentToOrder` mutation
 * will be passed through to the `createFulfillment` method as the last argument.
 *
 * @example
 * ```ts
 * let shipomatic;
 *
 * export const shipomaticFulfillmentHandler = new FulfillmentHandler({
 *   code: 'ship-o-matic',
 *   description: [{
 *     languageCode: LanguageCode.en,
 *     value: 'Generate tracking codes via the Ship-o-matic API'
 *   }],
 *
 *   args: {
 *     preferredService: {
 *       type: 'string',
 *       ui: {
           component: 'select-form-input',
 *         options: [
 *           { value: 'first_class' },
 *           { value: 'priority'},
 *           { value: 'standard' },
 *         ],
 *       },
 *     }
 *   },
 *
 *   init: () => {
 *     // some imaginary shipping service
 *     shipomatic = new ShipomaticClient(API_KEY);
 *   },
 *
 *   createFulfillment: async (ctx, orders, lines, args) => {
 *
 *      const shipment = getShipmentFromOrders(orders, lines);
 *
 *      try {
 *        const transaction = await shipomatic.transaction.create({
 *          shipment,
 *          service_level: args.preferredService,
 *          label_file_type: 'png',
 *        })
 *
 *        return {
 *          method: `Ship-o-matic ${args.preferredService}`,
 *          trackingCode: transaction.tracking_code,
 *          customFields: {
 *            shippingTransactionId: transaction.id,
 *          }
 *        };
 *      } catch (e: any) {
 *        // Errors thrown from within this function will
 *        // result in a CreateFulfillmentError being returned
 *        throw e;
 *      }
 *   },
 *
 *   onFulfillmentTransition: async (fromState, toState, { fulfillment }) => {
 *     if (toState === 'Cancelled') {
 *       await shipomatic.transaction.cancel({
 *         transaction_id: fulfillment.customFields.shippingTransactionId,
 *       });
 *     }
 *   }
 * });
 * ```
 *
 * @docsCategory fulfillment
 * @docsPage FulfillmentHandler
 * @docsWeight 0
 */
class FulfillmentHandler extends configurable_operation_1.ConfigurableOperationDef {
    constructor(config) {
        super(config);
        this.createFulfillmentFn = config.createFulfillment;
        if (config.onFulfillmentTransition) {
            this.onFulfillmentTransitionFn = config.onFulfillmentTransition;
        }
    }
    /**
     * @internal
     */
    createFulfillment(ctx, orders, lines, args) {
        return this.createFulfillmentFn(ctx, orders, lines, this.argsArrayToHash(args));
    }
    /**
     * @internal
     */
    onFulfillmentTransition(fromState, toState, data) {
        if (typeof this.onFulfillmentTransitionFn === 'function') {
            return this.onFulfillmentTransitionFn(fromState, toState, data);
        }
    }
}
exports.FulfillmentHandler = FulfillmentHandler;
//# sourceMappingURL=fulfillment-handler.js.map