"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectableJobQueueStrategy = void 0;
/**
 * @description
 * This is a helper class for implementations of {@link JobQueueStrategy} that need to
 * have init called before they can start a queue.
 * It simply collects calls to {@link JobQueueStrategy} `start()` and calls `start()` again after init.
 * When using the class `start()` should start with this snippet
 *
 * ```
 * Typescript
 * if (!this.hasInitialized) {
 *   this.started.set(queueName, process);
 *   return;
 * }
 * ```
 */
class InjectableJobQueueStrategy {
    constructor() {
        this.started = new Map();
        this.hasInitialized = false;
    }
    init(injector) {
        this.hasInitialized = true;
        for (const [queueName, process] of this.started) {
            this.start(queueName, process);
        }
        this.started.clear();
    }
    destroy() {
        this.hasInitialized = false;
    }
}
exports.InjectableJobQueueStrategy = InjectableJobQueueStrategy;
//# sourceMappingURL=injectable-job-queue-strategy.js.map