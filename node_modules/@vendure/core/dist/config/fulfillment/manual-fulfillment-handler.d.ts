import { FulfillmentHandler } from './fulfillment-handler';
export declare const manualFulfillmentHandler: FulfillmentHandler<{
    method: {
        type: "string";
        required: false;
    };
    trackingCode: {
        type: "string";
        required: false;
    };
}>;
