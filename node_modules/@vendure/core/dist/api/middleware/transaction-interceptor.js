"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const __1 = require("..");
const transaction_wrapper_1 = require("../../connection/transaction-wrapper");
const transactional_connection_1 = require("../../connection/transactional-connection");
const parse_context_1 = require("../common/parse-context");
const transaction_decorator_1 = require("../decorators/transaction.decorator");
/**
 * @description
 * Used by the {@link Transaction} decorator to create a transactional query runner
 * and attach it to the RequestContext.
 */
let TransactionInterceptor = class TransactionInterceptor {
    constructor(connection, transactionWrapper, reflector) {
        this.connection = connection;
        this.transactionWrapper = transactionWrapper;
        this.reflector = reflector;
    }
    intercept(context, next) {
        const { req } = (0, parse_context_1.parseContext)(context);
        const ctx = (0, __1.internal_getRequestContext)(req, context);
        if (ctx) {
            const transactionMode = this.reflector.get(transaction_decorator_1.TRANSACTION_MODE_METADATA_KEY, context.getHandler());
            const transactionIsolationLevel = this.reflector.get(transaction_decorator_1.TRANSACTION_ISOLATION_LEVEL_METADATA_KEY, context.getHandler());
            return (0, rxjs_1.of)(this.transactionWrapper.executeInTransaction(ctx, _ctx => {
                // Registers transactional request context associated
                // with execution handler function
                (0, __1.internal_setRequestContext)(req, _ctx, context);
                return next.handle();
            }, transactionMode, transactionIsolationLevel, this.connection.rawConnection));
        }
        else {
            return next.handle();
        }
    }
};
exports.TransactionInterceptor = TransactionInterceptor;
exports.TransactionInterceptor = TransactionInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transactional_connection_1.TransactionalConnection,
        transaction_wrapper_1.TransactionWrapper,
        core_1.Reflector])
], TransactionInterceptor);
//# sourceMappingURL=transaction-interceptor.js.map