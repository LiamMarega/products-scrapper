import { OnApplicationShutdown } from '@nestjs/common';
/**
 * This is the main module used when bootstrapping the worker process via
 * `bootstrapWorker()`. It contains the same imports as the AppModule except
 * for the ApiModule, which is not needed for the worker. Omitting the ApiModule
 * greatly increases startup time (about 4x in testing).
 */
export declare class WorkerModule implements OnApplicationShutdown {
    onApplicationShutdown(signal?: string): Promise<void>;
}
