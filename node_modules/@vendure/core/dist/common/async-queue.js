"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncQueue = void 0;
/**
 * @description
 * A queue class for limiting concurrent async tasks. This can be used e.g. to prevent
 * race conditions when working on a shared resource such as writing to a database.
 *
 * @docsCategory common
 */
class AsyncQueue {
    constructor(label = 'default', concurrency = 1) {
        this.label = label;
        this.concurrency = concurrency;
        if (!AsyncQueue.taskQueue[label]) {
            AsyncQueue.taskQueue[label] = [];
            AsyncQueue.running[label] = 0;
        }
    }
    get running() {
        return AsyncQueue.running[this.label];
    }
    inc() {
        AsyncQueue.running[this.label]++;
    }
    dec() {
        AsyncQueue.running[this.label]--;
    }
    /**
     * @description
     * Pushes a new task onto the queue, upon which the task will either execute immediately or
     * (if the number of running tasks is equal to the concurrency limit) enqueue the task to
     * be executed at the soonest opportunity.
     */
    push(task) {
        return new Promise((resolve, reject) => {
            void (this.running < this.concurrency
                ? this.runTask(task, resolve, reject)
                : this.enqueueTask(task, resolve, reject));
        });
    }
    async runTask(task, resolve, reject) {
        this.inc();
        try {
            const result = await task();
            resolve(result);
        }
        catch (e) {
            reject(e);
        }
        this.dec();
        if (this.getQueue().length > 0) {
            const nextTask = this.getQueue().shift();
            if (nextTask) {
                await this.runTask(nextTask.task, nextTask.resolve, nextTask.reject);
            }
        }
    }
    enqueueTask(task, resolve, reject) {
        this.getQueue().push({ task, resolve, reject });
    }
    getQueue() {
        return AsyncQueue.taskQueue[this.label];
    }
}
exports.AsyncQueue = AsyncQueue;
AsyncQueue.running = {};
AsyncQueue.taskQueue = {};
//# sourceMappingURL=async-queue.js.map