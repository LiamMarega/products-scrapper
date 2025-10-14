/**
 * @description
 * The base class for all events used by the EventBus system.
 *
 * @docsCategory events
 * */
export declare abstract class VendureEvent {
    readonly createdAt: Date;
    protected constructor();
}
