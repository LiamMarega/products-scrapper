import { JobListOptions } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { Injector } from '../common';
import { InspectableJobQueueStrategy } from '../config/job-queue/inspectable-job-queue-strategy';
import { Job } from './job';
import { PollingJobQueueStrategy } from './polling-job-queue-strategy';
import { JobData } from './types';
/**
 * @description
 * An in-memory {@link JobQueueStrategy}. This is the default strategy if not using a dedicated
 * JobQueue plugin (e.g. {@link DefaultJobQueuePlugin}). Not recommended for production, since
 * the queue will be cleared when the server stops, and can only be used when the JobQueueService is
 * started from the main server process:
 *
 * @example
 * ```ts
 * bootstrap(config)
 *   .then(app => app.get(JobQueueService).start());
 * ```
 *
 * Attempting to use this strategy when running the worker in a separate process (using `bootstrapWorker()`)
 * will result in an error on startup.
 *
 * Completed jobs will be evicted from the store every 2 hours to prevent a memory leak.
 *
 * @docsCategory JobQueue
 */
export declare class InMemoryJobQueueStrategy extends PollingJobQueueStrategy implements InspectableJobQueueStrategy {
    protected jobs: Map<ID, Job<any>>;
    protected unsettledJobs: {
        [queueName: string]: Array<{
            job: Job;
            updatedAt: Date;
        }>;
    };
    private timer;
    private evictJobsAfterMs;
    private processContext;
    private processContextChecked;
    init(injector: Injector): void;
    destroy(): void;
    add<Data extends JobData<Data> = object>(job: Job<Data>): Promise<Job<Data>>;
    findOne(id: ID): Promise<Job | undefined>;
    findMany(options?: JobListOptions): Promise<PaginatedList<Job>>;
    findManyById(ids: ID[]): Promise<Job[]>;
    next(queueName: string, waitingJobs?: Job[]): Promise<Job | undefined>;
    update(job: Job): Promise<void>;
    removeSettledJobs(queueNames?: string[], olderThan?: Date): Promise<number>;
    private applySort;
    private applyFilters;
    private applyPagination;
    /**
     * Delete old jobs from the `jobs` Map if they are settled and older than the value
     * defined in `this.pruneJobsAfterMs`. This prevents a memory leak as the job queue
     * grows indefinitely.
     */
    private evictSettledJobs;
    private checkProcessContext;
}
