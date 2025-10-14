import { INestApplicationContext } from '@nestjs/common';
import { WorkerHealthCheckConfig } from './worker-health.service';
/**
 * @description
 * This object is created by calling the {@link bootstrapWorker} function.
 *
 * @docsCategory worker
 */
export declare class VendureWorker {
    /**
     * @description
     * A reference to the `INestApplicationContext` object, which represents
     * the NestJS [standalone application](https://docs.nestjs.com/standalone-applications) instance.
     */
    app: INestApplicationContext;
    constructor(app: INestApplicationContext);
    /**
     * @description
     * Starts the job queues running so that the worker can handle background jobs.
     */
    startJobQueue(): Promise<VendureWorker>;
    /**
     * @description
     * Starts a simple http server which can be used as a health check on the worker instance.
     * This endpoint can be used by container orchestration services such as Kubernetes to
     * verify whether the worker is running.
     *
     * @since 1.2.0
     */
    startHealthCheckServer(healthCheckConfig: WorkerHealthCheckConfig): Promise<VendureWorker>;
}
