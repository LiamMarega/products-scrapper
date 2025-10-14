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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchJobBufferService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const config_service_1 = require("../../../config/config.service");
const inspectable_job_queue_strategy_1 = require("../../../config/job-queue/inspectable-job-queue-strategy");
const vendure_logger_1 = require("../../../config/logger/vendure-logger");
const job_queue_service_1 = require("../../../job-queue/job-queue.service");
const subscribable_job_1 = require("../../../job-queue/subscribable-job");
const constants_1 = require("../constants");
const collection_job_buffer_1 = require("./collection-job-buffer");
const search_index_job_buffer_1 = require("./search-index-job-buffer");
let SearchJobBufferService = class SearchJobBufferService {
    constructor(jobQueueService, configService, bufferUpdates) {
        this.jobQueueService = jobQueueService;
        this.configService = configService;
        this.bufferUpdates = bufferUpdates;
        this.searchIndexJobBuffer = new search_index_job_buffer_1.SearchIndexJobBuffer();
        this.collectionJobBuffer = new collection_job_buffer_1.CollectionJobBuffer();
    }
    onApplicationBootstrap() {
        if (this.bufferUpdates === true) {
            this.jobQueueService.addBuffer(this.searchIndexJobBuffer);
            this.jobQueueService.addBuffer(this.collectionJobBuffer);
        }
    }
    async getPendingSearchUpdates() {
        var _a, _b;
        if (!this.bufferUpdates) {
            return 0;
        }
        const bufferSizes = await this.jobQueueService.bufferSize(this.searchIndexJobBuffer, this.collectionJobBuffer);
        return (((_a = bufferSizes[this.searchIndexJobBuffer.id]) !== null && _a !== void 0 ? _a : 0) + ((_b = bufferSizes[this.collectionJobBuffer.id]) !== null && _b !== void 0 ? _b : 0));
    }
    async runPendingSearchUpdates() {
        if (!this.bufferUpdates) {
            return;
        }
        const { jobQueueStrategy } = this.configService.jobQueueOptions;
        const collectionFilterJobs = await this.jobQueueService.flush(this.collectionJobBuffer);
        if (collectionFilterJobs.length && (0, inspectable_job_queue_strategy_1.isInspectableJobQueueStrategy)(jobQueueStrategy)) {
            const subscribableCollectionJobs = collectionFilterJobs.map(job => new subscribable_job_1.SubscribableJob(job, jobQueueStrategy));
            await (0, rxjs_1.forkJoin)(...subscribableCollectionJobs.map(sj => sj.updates({ pollInterval: 500, timeoutMs: 15 * 60 * 1000 })))
                .toPromise()
                .catch(err => {
                vendure_logger_1.Logger.error(err.message);
            });
        }
        await this.jobQueueService.flush(this.searchIndexJobBuffer);
    }
};
exports.SearchJobBufferService = SearchJobBufferService;
exports.SearchJobBufferService = SearchJobBufferService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(constants_1.BUFFER_SEARCH_INDEX_UPDATES)),
    __metadata("design:paramtypes", [job_queue_service_1.JobQueueService,
        config_service_1.ConfigService, Boolean])
], SearchJobBufferService);
//# sourceMappingURL=search-job-buffer.service.js.map