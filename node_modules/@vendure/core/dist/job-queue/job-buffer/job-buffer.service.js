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
exports.JobBufferService = void 0;
const common_1 = require("@nestjs/common");
const errors_1 = require("../../common/error/errors");
const config_service_1 = require("../../config/config.service");
const vendure_logger_1 = require("../../config/logger/vendure-logger");
/**
 * @description
 * Used to manage {@link JobBuffer}s.Primarily intended to be used internally by the {@link JobQueueService}, which
 * exposes its public-facing functionality.
 */
let JobBufferService = class JobBufferService {
    constructor(configService) {
        this.configService = configService;
        this.buffers = new Set();
        this.storageStrategy = configService.jobQueueOptions.jobBufferStorageStrategy;
    }
    addBuffer(buffer) {
        const idAlreadyExists = Array.from(this.buffers).find(p => p.id === buffer.id);
        if (idAlreadyExists) {
            throw new errors_1.InternalServerError(`There is already a JobBufferProcessor with the id "${buffer.id}". Ids must be unique`);
        }
        this.buffers.add(buffer);
    }
    removeBuffer(buffer) {
        this.buffers.delete(buffer);
    }
    async add(job) {
        let collected = false;
        for (const buffer of this.buffers) {
            const shouldCollect = await buffer.collect(job);
            if (shouldCollect) {
                collected = true;
                await this.storageStrategy.add(buffer.id, job);
            }
        }
        return collected;
    }
    bufferSize(forBuffers) {
        const buffer = forBuffers !== null && forBuffers !== void 0 ? forBuffers : Array.from(this.buffers);
        return this.storageStrategy.bufferSize(buffer.map(p => (typeof p === 'string' ? p : p.id)));
    }
    async flush(forBuffers) {
        const { jobQueueStrategy } = this.configService.jobQueueOptions;
        const buffers = forBuffers !== null && forBuffers !== void 0 ? forBuffers : Array.from(this.buffers);
        const flushResult = await this.storageStrategy.flush(buffers.map(p => (typeof p === 'string' ? p : p.id)));
        const result = [];
        for (const buffer of this.buffers) {
            const jobsForBuffer = flushResult[buffer.id];
            if (jobsForBuffer === null || jobsForBuffer === void 0 ? void 0 : jobsForBuffer.length) {
                let jobsToAdd = jobsForBuffer;
                try {
                    jobsToAdd = await buffer.reduce(jobsForBuffer);
                }
                catch (e) {
                    vendure_logger_1.Logger.error(`Error encountered processing jobs in JobBuffer "${buffer.id}":\n${JSON.stringify(e.message)}`, undefined, e.stack);
                }
                for (const job of jobsToAdd) {
                    result.push(await jobQueueStrategy.add(job));
                }
            }
        }
        return result;
    }
};
exports.JobBufferService = JobBufferService;
exports.JobBufferService = JobBufferService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], JobBufferService);
//# sourceMappingURL=job-buffer.service.js.map