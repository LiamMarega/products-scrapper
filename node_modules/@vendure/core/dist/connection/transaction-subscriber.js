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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TransactionSubscriber_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionSubscriber = exports.TransactionSubscriberError = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const typeorm_2 = require("typeorm");
/**
 * This error should be thrown by an event subscription if types do not match
 *
 * @internal
 */
class TransactionSubscriberError extends Error {
}
exports.TransactionSubscriberError = TransactionSubscriberError;
/**
 * This subscriber listens to all transaction commit/rollback events emitted by TypeORM
 * so that we can be notified as soon as a particular queryRunner's transactions ends.
 *
 * This is used by the {@link EventBus} to prevent events from being published until their
 * associated transactions are complete.
 */
let TransactionSubscriber = TransactionSubscriber_1 = class TransactionSubscriber {
    constructor(connection) {
        this.connection = connection;
        this.subject$ = new rxjs_1.Subject();
        if (!connection.subscribers.find(subscriber => subscriber.constructor === TransactionSubscriber_1)) {
            connection.subscribers.push(this);
        }
    }
    afterTransactionCommit(event) {
        this.subject$.next(Object.assign({ type: 'commit' }, event));
    }
    afterTransactionRollback(event) {
        this.subject$.next(Object.assign({ type: 'rollback' }, event));
    }
    awaitCommit(queryRunner) {
        return this.awaitTransactionEvent(queryRunner, 'commit');
    }
    awaitRollback(queryRunner) {
        return this.awaitTransactionEvent(queryRunner, 'rollback');
    }
    awaitRelease(queryRunner) {
        return this.awaitTransactionEvent(queryRunner);
    }
    awaitTransactionEvent(queryRunner, type) {
        if (queryRunner.isTransactionActive) {
            return (0, rxjs_1.lastValueFrom)(this.subject$
                .pipe((0, operators_1.filter)(event => !event.queryRunner.isTransactionActive && event.queryRunner === queryRunner), (0, operators_1.take)(1), (0, operators_1.tap)(event => {
                if (type && event.type !== type) {
                    throw new TransactionSubscriberError(`Unexpected event type: ${event.type}. Expected ${type}.`);
                }
            }), (0, operators_1.map)(event => event.queryRunner), 
            // This `delay(0)` call appears to be necessary with the upgrade to TypeORM
            // v0.2.41, otherwise an active queryRunner can still get picked up in an event
            // subscriber function. This is manifested by the e2e test
            // "Transaction infrastructure › passing transaction via EventBus" failing
            // in the database-transactions.e2e-spec.ts suite, and a bunch of errors
            // in the default-search-plugin.e2e-spec.ts suite when using sqljs.
            (0, operators_1.delay)(0)));
        }
        else {
            return Promise.resolve(queryRunner);
        }
    }
};
exports.TransactionSubscriber = TransactionSubscriber;
exports.TransactionSubscriber = TransactionSubscriber = TransactionSubscriber_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectConnection)()),
    __metadata("design:paramtypes", [typeorm_2.Connection])
], TransactionSubscriber);
//# sourceMappingURL=transaction-subscriber.js.map