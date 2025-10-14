"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlJobQueueStrategy = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const typeorm_1 = require("typeorm");
const vendure_logger_1 = require("../../config/logger/vendure-logger");
const transactional_connection_1 = require("../../connection/transactional-connection");
const job_queue_1 = require("../../job-queue");
const polling_job_queue_strategy_1 = require("../../job-queue/polling-job-queue-strategy");
const list_query_builder_1 = require("../../service/helpers/list-query-builder/list-query-builder");
const job_record_entity_1 = require("./job-record.entity");
/**
 * @description
 * A {@link JobQueueStrategy} which uses the configured SQL database to persist jobs in the queue.
 * This strategy is used by the {@link DefaultJobQueuePlugin}.
 *
 * @docsCategory JobQueue
 */
class SqlJobQueueStrategy extends polling_job_queue_strategy_1.PollingJobQueueStrategy {
    init(injector) {
        this.rawConnection = injector.get(transactional_connection_1.TransactionalConnection).rawConnection;
        this.connection = injector.get(transactional_connection_1.TransactionalConnection);
        this.listQueryBuilder = injector.get(list_query_builder_1.ListQueryBuilder);
        super.init(injector);
    }
    destroy() {
        this.rawConnection = undefined;
        super.destroy();
    }
    async add(job, jobOptions) {
        if (!this.connectionAvailable(this.rawConnection)) {
            throw new Error('Connection not available');
        }
        const jobRecordRepository = (jobOptions === null || jobOptions === void 0 ? void 0 : jobOptions.ctx) && this.connection ? this.connection.getRepository(jobOptions.ctx, job_record_entity_1.JobRecord) :
            this.rawConnection.getRepository(job_record_entity_1.JobRecord);
        const constrainedData = this.constrainDataSize(job);
        const newRecord = this.toRecord(job, constrainedData, this.setRetries(job.queueName, job));
        const record = await jobRecordRepository.save(newRecord);
        return this.fromRecord(record);
    }
    /**
     * MySQL & MariaDB store job data as a "text" type which has a limit of 64kb. Going over that limit will cause the job to not be stored.
     * In order to try to prevent that, this method will truncate any strings in the `data` object over 2kb in size.
     */
    constrainDataSize(job) {
        var _a;
        const type = (_a = this.rawConnection) === null || _a === void 0 ? void 0 : _a.options.type;
        if (type === 'mysql' || type === 'mariadb') {
            const stringified = JSON.stringify(job.data);
            if (64 * 1024 <= stringified.length) {
                const truncatedKeys = [];
                const reduced = JSON.parse(stringified, (key, value) => {
                    if (typeof value === 'string' && 2048 < value.length) {
                        truncatedKeys.push({ key, size: value.length });
                        return `[truncated - originally ${value.length} bytes]`;
                    }
                    return value;
                });
                vendure_logger_1.Logger.warn(`Job data for "${job.queueName}" is too long to store with the ${type} driver (${Math.round(stringified.length / 1024)}kb).\nThe following keys were truncated: ${truncatedKeys
                    .map(({ key, size }) => `${key} (${size} bytes)`)
                    .join(', ')}`);
                return reduced;
            }
        }
    }
    async next(queueName) {
        if (!this.connectionAvailable(this.rawConnection)) {
            throw new Error('Connection not available');
        }
        const connection = this.rawConnection;
        const connectionType = this.rawConnection.options.type;
        const isSQLite = connectionType === 'sqlite' || connectionType === 'sqljs' || connectionType === 'better-sqlite3';
        return new Promise(async (resolve, reject) => {
            if (isSQLite) {
                try {
                    // SQLite driver does not support concurrent transactions. See https://github.com/typeorm/typeorm/issues/1884
                    const result = await this.getNextAndSetAsRunning(connection.manager, queueName, false);
                    resolve(result);
                }
                catch (e) {
                    reject(e);
                }
            }
            else {
                // Selecting the next job is wrapped in a transaction so that we can
                // set a lock on that row and immediately update the status to "RUNNING".
                // This prevents multiple worker processes from taking the same job when
                // running concurrent workers.
                connection
                    .transaction(async (transactionManager) => {
                    const result = await this.getNextAndSetAsRunning(transactionManager, queueName, true);
                    resolve(result);
                })
                    .catch(err => reject(err));
            }
        });
    }
    async getNextAndSetAsRunning(manager, queueName, setLock, waitingJobIds = []) {
        const qb = manager
            .getRepository(job_record_entity_1.JobRecord)
            .createQueryBuilder('record')
            .where('record.queueName = :queueName', { queueName })
            .andWhere(new typeorm_1.Brackets(qb1 => {
            qb1.where('record.state = :pending', {
                pending: generated_types_1.JobState.PENDING,
            }).orWhere('record.state = :retrying', { retrying: generated_types_1.JobState.RETRYING });
        }))
            .orderBy('record.createdAt', 'ASC');
        if (waitingJobIds.length) {
            qb.andWhere('record.id NOT IN (:...waitingJobIds)', { waitingJobIds });
        }
        if (setLock) {
            qb.setLock('pessimistic_write');
        }
        const record = await qb.getOne();
        if (record) {
            const job = this.fromRecord(record);
            if (record.state === generated_types_1.JobState.RETRYING && typeof this.backOffStrategy === 'function') {
                const msSinceLastFailure = Date.now() - +record.updatedAt;
                const backOffDelayMs = this.backOffStrategy(queueName, record.attempts, job);
                if (msSinceLastFailure < backOffDelayMs) {
                    return await this.getNextAndSetAsRunning(manager, queueName, setLock, [
                        ...waitingJobIds,
                        record.id,
                    ]);
                }
            }
            job.start();
            record.state = generated_types_1.JobState.RUNNING;
            await manager.getRepository(job_record_entity_1.JobRecord).save(record, { reload: false });
            return job;
        }
        else {
            return;
        }
    }
    async update(job) {
        if (!this.connectionAvailable(this.rawConnection)) {
            throw new Error('Connection not available');
        }
        await this.rawConnection
            .getRepository(job_record_entity_1.JobRecord)
            .createQueryBuilder('job')
            .update()
            .set(this.toRecord(job))
            .where('id = :id', { id: job.id })
            .andWhere('settledAt IS NULL')
            .execute();
    }
    async findMany(options) {
        if (!this.connectionAvailable(this.rawConnection)) {
            throw new Error('Connection not available');
        }
        return this.listQueryBuilder
            .build(job_record_entity_1.JobRecord, options)
            .getManyAndCount()
            .then(([items, totalItems]) => ({
            items: items.map(this.fromRecord),
            totalItems,
        }));
    }
    async findOne(id) {
        if (!this.connectionAvailable(this.rawConnection)) {
            throw new Error('Connection not available');
        }
        const record = await this.rawConnection.getRepository(job_record_entity_1.JobRecord).findOne({ where: { id } });
        if (record) {
            return this.fromRecord(record);
        }
    }
    async findManyById(ids) {
        if (!this.connectionAvailable(this.rawConnection)) {
            throw new Error('Connection not available');
        }
        return this.rawConnection
            .getRepository(job_record_entity_1.JobRecord)
            .find({ where: { id: (0, typeorm_1.In)(ids) } })
            .then(records => records.map(this.fromRecord));
    }
    async removeSettledJobs(queueNames = [], olderThan) {
        if (!this.connectionAvailable(this.rawConnection)) {
            throw new Error('Connection not available');
        }
        const findOptions = Object.assign(Object.assign({}, (0 < queueNames.length ? { queueName: (0, typeorm_1.In)(queueNames) } : {})), { isSettled: true, settledAt: (0, typeorm_1.LessThan)(olderThan || new Date()) });
        const toDelete = await this.rawConnection.getRepository(job_record_entity_1.JobRecord).find({ where: findOptions });
        const deleteCount = await this.rawConnection.getRepository(job_record_entity_1.JobRecord).count({ where: findOptions });
        await this.rawConnection.getRepository(job_record_entity_1.JobRecord).delete(findOptions);
        return deleteCount;
    }
    connectionAvailable(connection) {
        return !!this.rawConnection && this.rawConnection.isConnected;
    }
    toRecord(job, data, retries) {
        return new job_record_entity_1.JobRecord({
            id: job.id || undefined,
            queueName: job.queueName,
            data: data !== null && data !== void 0 ? data : job.data,
            state: job.state,
            progress: job.progress,
            result: job.result,
            error: job.error,
            startedAt: job.startedAt,
            settledAt: job.settledAt,
            isSettled: job.isSettled,
            retries: retries !== null && retries !== void 0 ? retries : job.retries,
            attempts: job.attempts,
        });
    }
    fromRecord(jobRecord) {
        return new job_queue_1.Job(jobRecord);
    }
}
exports.SqlJobQueueStrategy = SqlJobQueueStrategy;
//# sourceMappingURL=sql-job-queue-strategy.js.map