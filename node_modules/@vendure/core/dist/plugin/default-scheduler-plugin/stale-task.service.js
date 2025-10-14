"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaleTaskService = void 0;
const common_1 = require("@nestjs/common");
const cron_time_generator_1 = __importDefault(require("cron-time-generator"));
const croner_1 = require("croner");
const instrument_decorator_1 = require("../../common/instrument-decorator");
const config_1 = require("../../config");
const transactional_connection_1 = require("../../connection/transactional-connection");
const constants_1 = require("./constants");
const scheduled_task_record_entity_1 = require("./scheduled-task-record.entity");
/**
 * @description
 * This service finds and cleans stale locks, which can occur if a worker instance is
 * non-gracefully shut down while a task is ongoing, and the lock is never released.
 *
 * Failure to clean these stale locks will prevent the task from ever running again, since
 * workers will assume it is locked by another processes and will ignore it.
 */
let StaleTaskService = class StaleTaskService {
    constructor(connection) {
        this.connection = connection;
        // Cache the interval for each taskId
        this.taskIntervalMap = new Map();
    }
    /**
     * @description
     * Cleans stale task locks from the database.
     */
    async cleanStaleLocksForTask(task) {
        const now = new Date();
        try {
            const lockedTask = await this.fetchLockedTask(task.id);
            if (!lockedTask) {
                return;
            }
            const intervalMs = this.getScheduleIntervalMs(task);
            if (this.isStale(lockedTask, now, intervalMs)) {
                await this.clearStaleLock(lockedTask);
            }
        }
        catch (error) {
            config_1.Logger.error(`Error cleaning up stale task locks: ${error instanceof Error ? error.message : String(error)}`, constants_1.loggerCtx);
            throw error;
        }
    }
    async fetchLockedTask(taskId) {
        return this.connection.rawConnection
            .getRepository(scheduled_task_record_entity_1.ScheduledTaskRecord)
            .createQueryBuilder('task')
            .select(['task.taskId', 'task.lockedAt'])
            .where('task.lockedAt IS NOT NULL')
            .andWhere('task.taskId = :taskId', { taskId })
            .getOne();
    }
    /**
     * Returns the interval in ms between one run of the task, and the next.
     */
    getScheduleIntervalMs(task) {
        const cachedInterval = this.taskIntervalMap.get(task.id);
        if (cachedInterval) {
            return cachedInterval;
        }
        const schedule = task.options.schedule;
        const scheduleString = typeof schedule === 'function' ? schedule(cron_time_generator_1.default) : schedule;
        const cron = new croner_1.Cron(scheduleString);
        const nextFn = typeof cron.nextRun === 'function'
            ? cron.nextRun.bind(cron)
            : cron.next.bind(cron);
        const next1 = nextFn();
        if (!next1) {
            throw new Error('Could not compute next run times');
        }
        const next2 = nextFn(next1);
        if (!next2) {
            throw new Error('Could not compute next run times');
        }
        const interval = next2.getTime() - next1.getTime();
        this.taskIntervalMap.set(task.id, interval);
        return interval;
    }
    isStale(task, now, intervalMs) {
        if (!task.lockedAt) {
            return false;
        }
        return now.getTime() - task.lockedAt.getTime() > intervalMs;
    }
    async clearStaleLock(staleTask) {
        var _a, _b, _c;
        const repo = this.connection.rawConnection.getRepository(scheduled_task_record_entity_1.ScheduledTaskRecord);
        const result = await repo.update({ taskId: staleTask.taskId, lockedAt: (_a = staleTask.lockedAt) !== null && _a !== void 0 ? _a : undefined }, { lockedAt: null });
        if (result.affected && result.affected > 0) {
            config_1.Logger.verbose(`Successfully cleaned stale task locks for task "${staleTask.taskId}", which was locked at ${(_c = (_b = staleTask.lockedAt) === null || _b === void 0 ? void 0 : _b.toISOString()) !== null && _c !== void 0 ? _c : 'unknown'}`, constants_1.loggerCtx);
        }
        else {
            config_1.Logger.debug(`Skipped clearing lock for task "${staleTask.taskId}" because the lock has changed since observation`, constants_1.loggerCtx);
        }
    }
};
exports.StaleTaskService = StaleTaskService;
exports.StaleTaskService = StaleTaskService = __decorate([
    (0, common_1.Injectable)(),
    (0, instrument_decorator_1.Instrument)(),
    __metadata("design:paramtypes", [transactional_connection_1.TransactionalConnection])
], StaleTaskService);
//# sourceMappingURL=stale-task.service.js.map