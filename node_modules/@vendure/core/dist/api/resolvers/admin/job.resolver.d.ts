import { JobQueue, MutationCancelJobArgs, MutationFlushBufferedJobsArgs, MutationRemoveSettledJobsArgs, QueryJobArgs, QueryJobBufferSizeArgs, QueryJobsArgs, QueryJobsByIdArgs } from '@vendure/common/lib/generated-types';
import { ConfigService } from '../../../config';
import { JobQueueService } from '../../../job-queue';
import { JobBufferService } from '../../../job-queue/job-buffer/job-buffer.service';
export declare class JobResolver {
    private configService;
    private jobService;
    private jobBufferService;
    constructor(configService: ConfigService, jobService: JobQueueService, jobBufferService: JobBufferService);
    job(args: QueryJobArgs): Promise<import("../../../job-queue").Job<any> | undefined>;
    jobs(args: QueryJobsArgs): Promise<import("@vendure/common/lib/shared-types").PaginatedList<import("../../../job-queue").Job<any>>>;
    jobsById(args: QueryJobsByIdArgs): Promise<import("../../../job-queue").Job<any>[]>;
    jobQueues(): JobQueue[];
    removeSettledJobs(args: MutationRemoveSettledJobsArgs): Promise<number>;
    cancelJob(args: MutationCancelJobArgs): Promise<import("../../../job-queue").Job<any> | undefined>;
    jobBufferSize(args: QueryJobBufferSizeArgs): Promise<{
        bufferId: string;
        size: number;
    }[]>;
    flushBufferedJobs(args: MutationFlushBufferedJobsArgs): Promise<{
        success: boolean;
    }>;
    private requireInspectableJobQueueStrategy;
}
