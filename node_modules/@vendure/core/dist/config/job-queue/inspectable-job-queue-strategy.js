"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInspectableJobQueueStrategy = isInspectableJobQueueStrategy;
function isInspectableJobQueueStrategy(strategy) {
    return (strategy.findOne !== undefined &&
        strategy.findMany !== undefined &&
        strategy.findManyById !== undefined &&
        strategy.removeSettledJobs !== undefined);
}
//# sourceMappingURL=inspectable-job-queue-strategy.js.map