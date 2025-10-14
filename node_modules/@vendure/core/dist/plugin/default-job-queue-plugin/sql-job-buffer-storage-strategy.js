"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlJobBufferStorageStrategy = void 0;
const transactional_connection_1 = require("../../connection/transactional-connection");
const job_1 = require("../../job-queue/job");
const job_record_buffer_entity_1 = require("./job-record-buffer.entity");
/**
 * @description
 * This stores the buffered jobs in the database.
 */
class SqlJobBufferStorageStrategy {
    init(injector) {
        this.connection = injector.get(transactional_connection_1.TransactionalConnection);
    }
    async add(bufferId, job) {
        await this.connection.rawConnection.getRepository(job_record_buffer_entity_1.JobRecordBuffer).save(new job_record_buffer_entity_1.JobRecordBuffer({
            bufferId,
            job: this.toJobConfig(job),
        }));
        return job;
    }
    async bufferSize(bufferIds) {
        const qb = this.connection.rawConnection
            .getRepository(job_record_buffer_entity_1.JobRecordBuffer)
            .createQueryBuilder('record')
            .select('COUNT(*)', 'count')
            .addSelect('record.bufferId', 'bufferId');
        if (bufferIds === null || bufferIds === void 0 ? void 0 : bufferIds.length) {
            qb.andWhere('record.bufferId IN (:...bufferIds)', { bufferIds });
        }
        const rows = await qb.groupBy('record.bufferId').getRawMany();
        const result = {};
        for (const row of rows) {
            if (bufferIds)
                result[row.bufferId] = +row.count;
        }
        return result;
    }
    async flush(bufferIds) {
        const selectQb = this.connection.rawConnection
            .getRepository(job_record_buffer_entity_1.JobRecordBuffer)
            .createQueryBuilder('record');
        if (bufferIds === null || bufferIds === void 0 ? void 0 : bufferIds.length) {
            selectQb.where('record.bufferId IN (:...bufferIds)', { bufferIds });
        }
        const rows = await selectQb.getMany();
        const result = {};
        for (const row of rows) {
            if (!result[row.bufferId]) {
                result[row.bufferId] = [];
            }
            result[row.bufferId].push(new job_1.Job(row.job));
        }
        const deleteQb = this.connection.rawConnection.createQueryBuilder().delete().from(job_record_buffer_entity_1.JobRecordBuffer);
        if (bufferIds === null || bufferIds === void 0 ? void 0 : bufferIds.length) {
            deleteQb.where('bufferId IN (:...bufferIds)', { bufferIds });
        }
        await deleteQb.execute();
        return result;
    }
    toJobConfig(job) {
        var _a;
        return {
            queueName: job.queueName,
            data: job.data,
            retries: job.retries,
            attempts: job.attempts,
            state: job.state,
            progress: job.progress,
            result: job.result,
            error: job.error,
            createdAt: job.createdAt,
            startedAt: job.startedAt,
            settledAt: job.settledAt,
            id: (_a = job.id) !== null && _a !== void 0 ? _a : undefined,
        };
    }
}
exports.SqlJobBufferStorageStrategy = SqlJobBufferStorageStrategy;
//# sourceMappingURL=sql-job-buffer-storage-strategy.js.map