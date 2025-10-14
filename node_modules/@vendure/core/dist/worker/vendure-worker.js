"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendureWorker = void 0;
const job_queue_service_1 = require("../job-queue/job-queue.service");
const worker_health_service_1 = require("./worker-health.service");
/**
 * @description
 * This object is created by calling the {@link bootstrapWorker} function.
 *
 * @docsCategory worker
 */
class VendureWorker {
    constructor(app) {
        this.app = app;
    }
    /**
     * @description
     * Starts the job queues running so that the worker can handle background jobs.
     */
    async startJobQueue() {
        await this.app.get(job_queue_service_1.JobQueueService).start();
        return this;
    }
    /**
     * @description
     * Starts a simple http server which can be used as a health check on the worker instance.
     * This endpoint can be used by container orchestration services such as Kubernetes to
     * verify whether the worker is running.
     *
     * @since 1.2.0
     */
    async startHealthCheckServer(healthCheckConfig) {
        await this.app.get(worker_health_service_1.WorkerHealthService).initializeHealthCheckEndpoint(healthCheckConfig);
        return this;
    }
}
exports.VendureWorker = VendureWorker;
//# sourceMappingURL=vendure-worker.js.map