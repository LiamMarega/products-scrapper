export type Task<T = any> = () => Promise<T> | T;
export type Resolve<T> = (val: T) => void;
export type Reject<T> = (val: T) => void;
/**
 * @description
 * A queue class for limiting concurrent async tasks. This can be used e.g. to prevent
 * race conditions when working on a shared resource such as writing to a database.
 *
 * @docsCategory common
 */
export declare class AsyncQueue {
    private label;
    private concurrency;
    private static running;
    private static taskQueue;
    constructor(label?: string, concurrency?: number);
    private get running();
    private inc;
    private dec;
    /**
     * @description
     * Pushes a new task onto the queue, upon which the task will either execute immediately or
     * (if the number of running tasks is equal to the concurrency limit) enqueue the task to
     * be executed at the soonest opportunity.
     */
    push<T>(task: Task<T>): Promise<T>;
    private runTask;
    private enqueueTask;
    private getQueue;
}
