import { JobListOptions } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { Injector } from '../../common/injector';
import { InspectableJobQueueStrategy } from '../../config';
import { Job, JobData, JobQueueStrategyJobOptions } from '../../job-queue';
import { PollingJobQueueStrategy } from '../../job-queue/polling-job-queue-strategy';
/**
 * @description
 * A {@link JobQueueStrategy} which uses the configured SQL database to persist jobs in the queue.
 * This strategy is used by the {@link DefaultJobQueuePlugin}.
 *
 * @docsCategory JobQueue
 */
export declare class SqlJobQueueStrategy extends PollingJobQueueStrategy implements InspectableJobQueueStrategy {
    private rawConnection;
    private connection;
    private listQueryBuilder;
    init(injector: Injector): void;
    destroy(): void;
    add<Data extends JobData<Data> = object>(job: Job<Data>, jobOptions?: JobQueueStrategyJobOptions<Data>): Promise<Job<Data>>;
    /**
     * MySQL & MariaDB store job data as a "text" type which has a limit of 64kb. Going over that limit will cause the job to not be stored.
     * In order to try to prevent that, this method will truncate any strings in the `data` object over 2kb in size.
     */
    private constrainDataSize;
    next(queueName: string): Promise<Job | undefined>;
    private getNextAndSetAsRunning;
    update(job: Job<any>): Promise<void>;
    findMany(options?: JobListOptions): Promise<PaginatedList<Job>>;
    findOne(id: ID): Promise<Job | undefined>;
    findManyById(ids: ID[]): Promise<Job[]>;
    removeSettledJobs(queueNames?: string[], olderThan?: Date): Promise<number>;
    private connectionAvailable;
    private toRecord;
    private fromRecord;
}
