import { OnModuleDestroy } from '@nestjs/common';
import { JobQueue as GraphQlJobQueue } from '@vendure/common/lib/generated-types';
import { ConfigService } from '../config';
import { Job } from './job';
import { JobBuffer } from './job-buffer/job-buffer';
import { JobBufferService } from './job-buffer/job-buffer.service';
import { JobQueue } from './job-queue';
import { CreateQueueOptions, JobData } from './types';
/**
 * @description
 * The JobQueueService is used to create new {@link JobQueue} instances and access
 * existing jobs.
 *
 * @example
 * ```ts
 * // A service which transcodes video files
 * class VideoTranscoderService {
 *
 *   private jobQueue: JobQueue<{ videoId: string; }>;
 *
 *   async onModuleInit() {
 *     // The JobQueue is created on initialization
 *     this.jobQueue = await this.jobQueueService.createQueue({
 *       name: 'transcode-video',
 *       process: async job => {
 *         return await this.transcodeVideo(job.data.videoId);
 *       },
 *     });
 *   }
 *
 *   addToTranscodeQueue(videoId: string) {
 *     this.jobQueue.add({ videoId, })
 *   }
 *
 *   private async transcodeVideo(videoId: string) {
 *     // e.g. call some external transcoding service
 *   }
 *
 * }
 * ```
 *
 * @docsCategory JobQueue
 */
export declare class JobQueueService implements OnModuleDestroy {
    private configService;
    private jobBufferService;
    private queues;
    private hasStarted;
    private get jobQueueStrategy();
    constructor(configService: ConfigService, jobBufferService: JobBufferService);
    /** @internal */
    onModuleDestroy(): Promise<void[]>;
    /**
     * @description
     * Configures and creates a new {@link JobQueue} instance.
     */
    createQueue<Data extends JobData<Data>>(options: CreateQueueOptions<Data>): Promise<JobQueue<Data>>;
    start(): Promise<void>;
    /**
     * @description
     * Adds a {@link JobBuffer}, which will make it active and begin collecting
     * jobs to buffer.
     *
     * @since 1.3.0
     */
    addBuffer(buffer: JobBuffer<any>): void;
    /**
     * @description
     * Removes a {@link JobBuffer}, prevent it from collecting and buffering any
     * subsequent jobs.
     *
     * @since 1.3.0
     */
    removeBuffer(buffer: JobBuffer<any>): void;
    /**
     * @description
     * Returns an object containing the number of buffered jobs arranged by bufferId. This
     * can be used to decide whether a particular buffer has any jobs to flush.
     *
     * Passing in JobBuffer instances _or_ ids limits the results to the specified JobBuffers.
     * If no argument is passed, sizes will be returned for _all_ JobBuffers.
     *
     * @example
     * ```ts
     * const sizes = await this.jobQueueService.bufferSize('buffer-1', 'buffer-2');
     *
     * // sizes = { 'buffer-1': 12, 'buffer-2': 3 }
     * ```
     *
     * @since 1.3.0
     */
    bufferSize(...forBuffers: Array<JobBuffer<any> | string>): Promise<{
        [bufferId: string]: number;
    }>;
    /**
     * @description
     * Flushes the specified buffers, which means that the buffer is cleared and the jobs get
     * sent to the job queue for processing. Before sending the jobs to the job queue,
     * they will be passed through each JobBuffer's `reduce()` method, which is can be used
     * to optimize the amount of work to be done by e.g. de-duplicating identical jobs or
     * aggregating data over the collected jobs.
     *
     * Passing in JobBuffer instances _or_ ids limits the action to the specified JobBuffers.
     * If no argument is passed, _all_ JobBuffers will be flushed.
     *
     * Returns an array of all Jobs which were added to the job queue.
     *
     * @since 1.3.0
     */
    flush(...forBuffers: Array<JobBuffer<any> | string>): Promise<Job[]>;
    /**
     * @description
     * Returns an array of `{ name: string; running: boolean; }` for each
     * registered JobQueue.
     */
    getJobQueues(): GraphQlJobQueue[];
    /**
     * We wrap the process function in order to catch any errors thrown and pass them to
     * any configured ErrorHandlerStrategies.
     */
    private createWrappedProcessFn;
    private shouldStartQueue;
}
