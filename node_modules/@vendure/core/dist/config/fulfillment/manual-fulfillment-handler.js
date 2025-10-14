"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manualFulfillmentHandler = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const fulfillment_handler_1 = require("./fulfillment-handler");
exports.manualFulfillmentHandler = new fulfillment_handler_1.FulfillmentHandler({
    code: 'manual-fulfillment',
    description: [{ languageCode: generated_types_1.LanguageCode.en, value: 'Manually enter fulfillment details' }],
    args: {
        method: {
            type: 'string',
            required: false,
        },
        trackingCode: {
            type: 'string',
            required: false,
        },
    },
    createFulfillment: (ctx, orders, orderItems, args) => {
        return {
            method: args.method,
            trackingCode: args.trackingCode,
        };
    },
});
//# sourceMappingURL=manual-fulfillment-handler.js.map