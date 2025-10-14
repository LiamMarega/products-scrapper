import { JobState } from '@vendure/common/lib/generated-types';
import { JobConfig, JobData } from './types';
/**
 * @description
 * An event raised by a Job.
 *
 * @docsCategory JobQueue
 * @docsPage Job
 */
export type JobEventType = 'progress';
/**
 * @description
 * The signature of the event handler expected by the `Job.on()` method.
 *
 * @docsCategory JobQueue
 * @docsPage Job
 */
export type JobEventListener<T extends JobData<T>> = (job: Job<T>) => void;
/**
 * @description
 * A Job represents a piece of work to be run in the background, i.e. outside the request-response cycle.
 * It is intended to be used for long-running work triggered by API requests. Jobs should now generally
 * be directly instantiated. Rather, the {@link JobQueue} `add()` method should be used to create and
 * add a new Job to a queue.
 *
 * @docsCategory JobQueue
 * @docsPage Job
 * @docsWeight 0
 */
export declare class Job<T extends JobData<T> = any> {
    readonly id: number | string | null;
    readonly queueName: string;
    readonly retries: number;
    readonly createdAt: Date;
    private readonly _data;
    private _state;
    private _progress;
    private _result?;
    private _error?;
    private _attempts;
    private _startedAt?;
    private _settledAt?;
    private readonly eventListeners;
    get name(): string;
    get data(): T;
    get state(): JobState;
    get progress(): number;
    get result(): any;
    get error(): any;
    get isSettled(): boolean;
    get startedAt(): Date | undefined;
    get settledAt(): Date | undefined;
    get duration(): number;
    get attempts(): number;
    constructor(config: JobConfig<T>);
    /**
     * @description
     * Calling this signifies that the job work has started. This method should be
     * called in the {@link JobQueueStrategy} `next()` method.
     */
    start(): void;
    /**
     * @description
     * Sets the progress (0 - 100) of the job.
     */
    setProgress(percent: number): void;
    /**
     * @description
     * Calling this method signifies that the job succeeded. The result
     * will be stored in the `Job.result` property.
     */
    complete(result?: any): void;
    /**
     * @description
     * Calling this method signifies that the job failed.
     */
    fail(err?: any): void;
    cancel(): void;
    /**
     * @description
     * Sets a RUNNING job back to PENDING. Should be used when the JobQueue is being
     * destroyed before the job has been completed.
     */
    defer(): void;
    /**
     * @description
     * Used to register event handler for job events
     */
    on(eventType: JobEventType, listener: JobEventListener<T>): void;
    off(eventType: JobEventType, listener: JobEventListener<T>): void;
    private fireEvent;
    /**
     * All data in a job must be serializable. This method handles certain problem cases such as when
     * the data is a class instance with getters. Even though technically the "data" object should
     * already be serializable per the TS type, in practice data can slip through due to loss of
     * type safety.
     */
    private ensureDataIsSerializable;
    private hasToJSONFunction;
}
