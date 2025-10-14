import { OnModuleDestroy } from '@nestjs/common';
/**
 * @description
 * Specifies the configuration for the Worker's HTTP health check endpoint.
 *
 * @since 1.2.0
 * @docsCategory worker
 */
export interface WorkerHealthCheckConfig {
    /**
     * @description
     * The port on which the worker will listen
     */
    port: number;
    /**
     * @description
     * The hostname
     *
     * @default 'localhost'
     */
    hostname?: string;
    /**
     * @description
     * The route at which the health check is available.
     *
     * @default '/health'
     */
    route?: string;
}
export declare class WorkerHealthService implements OnModuleDestroy {
    private server;
    initializeHealthCheckEndpoint(config: WorkerHealthCheckConfig): Promise<void>;
    onModuleDestroy(): any;
}
