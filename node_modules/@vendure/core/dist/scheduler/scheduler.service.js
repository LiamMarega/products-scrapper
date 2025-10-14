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
exports.SchedulerService = void 0;
const common_1 = require("@nestjs/common");
const cron_time_generator_1 = __importDefault(require("cron-time-generator"));
const croner_1 = require("croner");
const cronstrue_1 = __importDefault(require("cronstrue"));
const config_service_1 = require("../config/config.service");
const vendure_logger_1 = require("../config/logger/vendure-logger");
const process_context_1 = require("../process-context");
const noop_scheduler_strategy_1 = require("./noop-scheduler-strategy");
/**
 * @description
 * The service that is responsible for setting up and querying the scheduled tasks.
 *
 * @since 3.3.0
 * @docsCategory scheduled-tasks
 */
let SchedulerService = class SchedulerService {
    constructor(configService, processContext) {
        this.configService = configService;
        this.processContext = processContext;
        this.jobs = new Map();
        this.shouldRunTasks = false;
        this.runningTasks = 0;
    }
    onApplicationBootstrap() {
        var _a, _b;
        const schedulerStrategy = this.configService.schedulerOptions.schedulerStrategy;
        if (!schedulerStrategy || schedulerStrategy instanceof noop_scheduler_strategy_1.NoopSchedulerStrategy) {
            vendure_logger_1.Logger.warn('No scheduler strategy is configured! Scheduled tasks will not be executed.');
            vendure_logger_1.Logger.warn('Please use the `DefaultSchedulerPlugin` (or alternative) to enable scheduled tasks.');
            return;
        }
        this.shouldRunTasks =
            this.configService.schedulerOptions.runTasksInWorkerOnly === false ||
                this.processContext.isWorker;
        const scheduledTasks = (_a = this.configService.schedulerOptions.tasks) !== null && _a !== void 0 ? _a : [];
        for (const task of scheduledTasks) {
            const job = this.createCronJob(task);
            const pattern = job.getPattern();
            if (!pattern) {
                vendure_logger_1.Logger.warn(`Invalid cron pattern for task ${task.id}`);
            }
            else {
                if (this.shouldRunTasks) {
                    const schedule = cronstrue_1.default.toString(pattern);
                    vendure_logger_1.Logger.info(`Registered scheduled task: ${task.id} - ${schedule}`);
                }
                this.jobs.set(task.id, { task, job });
            }
            (_b = schedulerStrategy.registerTask) === null || _b === void 0 ? void 0 : _b.call(schedulerStrategy, task);
        }
    }
    async onApplicationShutdown(signal) {
        for (const job of this.jobs.values()) {
            job.job.stop();
        }
        const startTime = Date.now();
        // If any tasks are still running, wait a short time for them to finish
        const maxWaitTime = 10000;
        while (this.runningTasks > 0 && Date.now() - startTime < maxWaitTime) {
            vendure_logger_1.Logger.warn(`Waiting for ${this.runningTasks} running tasks to finish before shutting down (signal: ${signal !== null && signal !== void 0 ? signal : 'unknown'})`);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    /**
     * @description
     * Returns a list of all the scheduled tasks and their current status.
     */
    getTaskList() {
        return this.configService.schedulerOptions.schedulerStrategy
            .getTasks()
            .then(taskReports => taskReports.map(taskReport => this.createTaskInfo(taskReport)).filter(x => x !== undefined));
    }
    updateTask(input) {
        return this.configService.schedulerOptions.schedulerStrategy.updateTask(input).then(taskReport => {
            const taskInfo = this.createTaskInfo(taskReport);
            if (!taskInfo) {
                throw new Error(`Task ${input.id} not found`);
            }
            return taskInfo;
        });
    }
    async runTask(taskId) {
        const task = this.jobs.get(taskId);
        if (!task) {
            return {
                success: false,
            };
        }
        try {
            await this.configService.schedulerOptions.schedulerStrategy.triggerTask(task.task);
            return {
                success: true,
            };
        }
        catch (e) {
            vendure_logger_1.Logger.error(`Could not trigger task: ` + e.message);
            return {
                success: false,
            };
        }
    }
    createTaskInfo(taskReport) {
        var _a, _b, _c;
        const job = (_a = this.jobs.get(taskReport.id)) === null || _a === void 0 ? void 0 : _a.job;
        const task = (_b = this.jobs.get(taskReport.id)) === null || _b === void 0 ? void 0 : _b.task;
        if (!job || !task) {
            return;
        }
        const pattern = job.getPattern();
        return {
            id: taskReport.id,
            description: (_c = task.options.description) !== null && _c !== void 0 ? _c : '',
            schedule: pattern !== null && pattern !== void 0 ? pattern : 'unknown',
            scheduleDescription: pattern ? cronstrue_1.default.toString(pattern) : 'unknown',
            lastExecutedAt: taskReport.lastExecutedAt,
            nextExecutionAt: job.nextRun(),
            isRunning: taskReport.isRunning,
            lastResult: taskReport.lastResult,
            enabled: taskReport.enabled,
        };
    }
    createCronJob(task) {
        const schedulerStrategy = this.configService.schedulerOptions.schedulerStrategy;
        const protectCallback = (_job) => {
            const currentRun = _job.currentRun();
            if (currentRun) {
                vendure_logger_1.Logger.warn(`Task invocation of ${task.id} at ${new Date().toISOString()} was blocked because an existing task is still running at ${currentRun.toISOString()}`);
            }
        };
        const schedule = typeof task.options.schedule === 'function'
            ? task.options.schedule(cron_time_generator_1.default)
            : task.options.schedule;
        const job = new croner_1.Cron(schedule, {
            name: task.id,
            protect: task.options.preventOverlap ? protectCallback : undefined,
        }, () => {
            if (this.shouldRunTasks) {
                // Only execute the cron task on the worker process
                // so that any expensive logic does not affect
                // the responsiveness of server processes
                this.runningTasks++;
                try {
                    schedulerStrategy.executeTask(task)(job);
                }
                catch (e) {
                    const message = e instanceof Error ? e.message : String(e);
                    vendure_logger_1.Logger.error(`Error executing scheduled task ${task.id}: ${message}`);
                }
                finally {
                    this.runningTasks--;
                }
            }
        });
        return job;
    }
};
exports.SchedulerService = SchedulerService;
exports.SchedulerService = SchedulerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService,
        process_context_1.ProcessContext])
], SchedulerService);
//# sourceMappingURL=scheduler.service.js.map