"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.TRANSACTION_ISOLATION_LEVEL_METADATA_KEY = exports.TRANSACTION_MODE_METADATA_KEY = void 0;
const common_1 = require("@nestjs/common");
const transaction_interceptor_1 = require("../middleware/transaction-interceptor");
exports.TRANSACTION_MODE_METADATA_KEY = '__transaction_mode__';
exports.TRANSACTION_ISOLATION_LEVEL_METADATA_KEY = '__transaction_isolation_level__';
/**
 * @description
 * Runs the decorated method in a TypeORM transaction. It works by creating a transactional
 * QueryRunner which gets attached to the RequestContext object. When the RequestContext
 * is the passed to the {@link TransactionalConnection} `getRepository()` method, this
 * QueryRunner is used to execute the queries within this transaction.
 *
 * Essentially, the entire resolver function is wrapped in a try-catch block which commits the
 * transaction on successful completion of the method, or rolls back the transaction in an unhandled
 * error is thrown.
 *
 * @example
 * ```ts
 * // in a GraphQL resolver file
 *
 * \@Transaction()
 * async myMutation(\@Ctx() ctx: RequestContext) {
 *   // as long as the `ctx` object is passed in to
 *   // all database operations, the entire mutation
 *   // will be run as an atomic transaction, and rolled
 *   // back if an error is thrown.
 *   const result = this.myService.createThing(ctx);
 *   return this.myService.updateOtherThing(ctx, result.id);
 * }
 * ```
 *
 * @docsCategory request
 * @docsPage Transaction Decorator
 * @docsWeight 0
 */
const Transaction = (transactionMode = 'auto', transactionIsolationLevel) => {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)(exports.TRANSACTION_MODE_METADATA_KEY, transactionMode), (0, common_1.SetMetadata)(exports.TRANSACTION_ISOLATION_LEVEL_METADATA_KEY, transactionIsolationLevel), (0, common_1.UseInterceptors)(transaction_interceptor_1.TransactionInterceptor));
};
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.decorator.js.map