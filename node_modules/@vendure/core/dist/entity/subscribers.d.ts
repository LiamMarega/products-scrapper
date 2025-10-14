import { EntitySubscriberInterface, InsertEvent } from 'typeorm';
/**
 * @docs Subscribes to events entities to handle calculated decorators
 *
 * @docsCategory data-access
 */
export declare class CalculatedPropertySubscriber implements EntitySubscriberInterface {
    afterLoad(event: any): void;
    afterInsert(event: InsertEvent<any>): Promise<any> | void;
    /**
     * For any entity properties decorated with @Calculated(), this subscriber transfers
     * the getter from the entity prototype to the entity instance, so that it can be
     * correctly enumerated and serialized in the API response.
     */
    private moveCalculatedGettersToInstance;
}
/**
 * A map of the core TypeORM Subscribers.
 */
export declare const coreSubscribersMap: {
    CalculatedPropertySubscriber: typeof CalculatedPropertySubscriber;
};
