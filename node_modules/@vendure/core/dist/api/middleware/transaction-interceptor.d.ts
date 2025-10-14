import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { TransactionWrapper } from '../../connection/transaction-wrapper';
import { TransactionalConnection } from '../../connection/transactional-connection';
/**
 * @description
 * Used by the {@link Transaction} decorator to create a transactional query runner
 * and attach it to the RequestContext.
 */
export declare class TransactionInterceptor implements NestInterceptor {
    private connection;
    private transactionWrapper;
    private reflector;
    constructor(connection: TransactionalConnection, transactionWrapper: TransactionWrapper, reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
