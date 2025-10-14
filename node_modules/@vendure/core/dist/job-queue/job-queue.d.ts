import { JobQueueStrategy } from '../config';
import { JobBufferService } from './job-buffer/job-buffer.service';
import { SubscribableJob } from './subscribable-job';
import { CreateQueueOptions, JobData, JobOptions } from './types';
/**
 * @description
 * A JobQueue is used to process {@link Job}s. A job is added to the queue via the
 * `.add()` method, and the configured {@link JobQueueStrategy} will check for new jobs and process each
 * according to the defined `process` function.
 *
 * *Note*: JobQueue instances should not be directly instantiated. Rather, the
 * {@link JobQueueService} `createQueue()` method should be used (see that service
 * for example usage).
 *
 * @docsCategory JobQueue
 */
export declare class JobQueue<Data extends JobData<Data> = object> {
    private options;
    private jobQueueStrategy;
    private jobBufferService;
    private running;
    get name(): string;
    get started(): boolean;
    constructor(options: CreateQueueOptions<Data>, jobQueueStrategy: JobQueueStrategy, jobBufferService: JobBufferService);
    /** @internal */
    start(): Promise<void>;
    /** @internal */
    stop(): Promise<void>;
    /**
     * @description
     * Adds a new {@link Job} to the queue. The resolved {@link SubscribableJob} allows the
     * calling code to subscribe to updates to the Job:
     *
     * @example
     * ```ts
     * const job = await this.myQueue.add({ intervalMs, shouldFail }, { retries: 2 });
     * return job.updates().pipe(
     *   map(update => {
     *     // The returned Observable will emit a value for every update to the job
     *     // such as when the `progress` or `status` value changes.
     *     Logger.info(`Job ${update.id}: progress: ${update.progress}`);
     *     if (update.state === JobState.COMPLETED) {
     *       Logger.info(`COMPLETED ${update.id}: ${update.result}`);
     *     }
     *     return update.result;
     *   }),
     *   catchError(err => of(err.message)),
     * );
     * ```
     *
     * Alternatively, if you aren't interested in the intermediate
     * `progress` changes, you can convert to a Promise like this:
     *
     * @example
     * ```ts
     * const job = await this.myQueue.add({ intervalMs, shouldFail }, { retries: 2 });
     * return job.updates().toPromise()
     *   .then(update => update.result),
     *   .catch(err => err.message);
     * ```
     */
    add(data: Data, options?: JobOptions<Data>): Promise<SubscribableJob<Data>>;
}
