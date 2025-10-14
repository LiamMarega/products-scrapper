import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';
import { RequestContext } from '../api/common/request-context';
import { TransactionIsolationLevel, TransactionMode } from '../api/decorators/transaction.decorator';
/**
 * @description
 * This helper class is used to wrap operations in a TypeORM transaction in order to ensure
 * atomic operations on the database.
 */
export declare class TransactionWrapper {
    /**
     * @description
     * Executes the `work` function within the context of a transaction. If the `work` function
     * resolves / completes, then all the DB operations it contains will be committed. If it
     * throws an error or rejects, then all DB operations will be rolled back.
     *
     * @note
     * This function does not mutate your context. Instead, this function makes a copy and passes
     * context to work function.
     */
    executeInTransaction<T>(originalCtx: RequestContext, work: (ctx: RequestContext) => Observable<T> | Promise<T>, mode: TransactionMode, isolationLevel: TransactionIsolationLevel | undefined, connection: DataSource): Promise<T>;
    /**
     * Attempts to start a DB transaction, with retry logic in the case that a transaction
     * is already started for the connection (which is mainly a problem with SQLite/Sql.js)
     */
    private startTransaction;
    /**
     * If the resolver function throws an error, there are certain cases in which
     * we want to retry the whole thing again - notably in the case of a deadlock
     * situation, which can usually be retried with success.
     */
    private isRetriableError;
}
