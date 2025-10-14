import { Connection, EntitySubscriberInterface } from 'typeorm';
import { EntityManager } from 'typeorm/entity-manager/EntityManager';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import { TransactionCommitEvent } from 'typeorm/subscriber/event/TransactionCommitEvent';
import { TransactionRollbackEvent } from 'typeorm/subscriber/event/TransactionRollbackEvent';
/**
 * This error should be thrown by an event subscription if types do not match
 *
 * @internal
 */
export declare class TransactionSubscriberError extends Error {
}
export type TransactionSubscriberEventType = 'commit' | 'rollback';
export interface TransactionSubscriberEvent {
    /**
     * Event type. Either commit or rollback.
     */
    type: TransactionSubscriberEventType;
    /**
     * Connection used in the event.
     */
    connection: Connection;
    /**
     * QueryRunner used in the event transaction.
     * All database operations in the subscribed event listener should be performed using this query runner instance.
     */
    queryRunner: QueryRunner;
    /**
     * EntityManager used in the event transaction.
     * All database operations in the subscribed event listener should be performed using this entity manager instance.
     */
    manager: EntityManager;
}
/**
 * This subscriber listens to all transaction commit/rollback events emitted by TypeORM
 * so that we can be notified as soon as a particular queryRunner's transactions ends.
 *
 * This is used by the {@link EventBus} to prevent events from being published until their
 * associated transactions are complete.
 */
export declare class TransactionSubscriber implements EntitySubscriberInterface {
    private connection;
    private subject$;
    constructor(connection: Connection);
    afterTransactionCommit(event: TransactionCommitEvent): void;
    afterTransactionRollback(event: TransactionRollbackEvent): void;
    awaitCommit(queryRunner: QueryRunner): Promise<QueryRunner>;
    awaitRollback(queryRunner: QueryRunner): Promise<QueryRunner>;
    awaitRelease(queryRunner: QueryRunner): Promise<QueryRunner>;
    private awaitTransactionEvent;
}
