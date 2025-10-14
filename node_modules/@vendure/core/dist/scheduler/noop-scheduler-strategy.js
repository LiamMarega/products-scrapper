"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoopSchedulerStrategy = void 0;
const vendure_logger_1 = require("../config/logger/vendure-logger");
class NoopSchedulerStrategy {
    getTasks() {
        return Promise.resolve([]);
    }
    getTask(id) {
        return Promise.resolve(undefined);
    }
    executeTask(task) {
        vendure_logger_1.Logger.warn(`No task scheduler is configured! The task ${task.id} will not be executed.`);
        return () => Promise.resolve();
    }
    updateTask(input) {
        throw new Error(`Not implemented`);
    }
    triggerTask(task) {
        throw new Error(`Not implemented`);
    }
}
exports.NoopSchedulerStrategy = NoopSchedulerStrategy;
//# sourceMappingURL=noop-scheduler-strategy.js.map