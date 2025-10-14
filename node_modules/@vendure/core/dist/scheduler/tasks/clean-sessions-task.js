"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanSessionsTask = void 0;
const session_service_1 = require("../../service/services/session.service");
const scheduled_task_1 = require("../scheduled-task");
/**
 * @description
 * A {@link ScheduledTask} that cleans expired & inactive sessions from the database.
 *
 * @example
 * ```ts
 * import { cleanSessionsTask, VendureConfig } from '\@vendure/core';
 *
 * export const config: VendureConfig = {
 *   // ...
 *   schedulerOptions: {
 *     tasks: [
 *       // Use the task as is
 *       cleanSessionsTask,
 *       // or configure the task
 *       cleanSessionsTask.configure({
 *         // Run the task every day at 3:00am
 *         // The default schedule is every day at 00:00am
 *         schedule: cron => cron.everyDayAt(3, 0),
 *         params: {
 *           // How many sessions to process in each batch
 *           // Default: 1000
 *           batchSize: 5_000,
 *         },
 *       }),
 *     ],
 *   },
 * };
 * ```
 *
 * @since 3.3.0
 * @docsCategory scheduled-tasks
 */
exports.cleanSessionsTask = new scheduled_task_1.ScheduledTask({
    id: 'clean-sessions',
    description: 'Clean expired & inactive sessions from the database',
    params: {
        batchSize: 1000,
    },
    schedule: cron => cron.everyDayAt(0, 0),
    async execute({ injector, params }) {
        const sessionService = injector.get(session_service_1.SessionService);
        await sessionService.triggerCleanSessionsJob(params.batchSize);
        return { result: 'Triggered clean sessions job' };
    },
});
//# sourceMappingURL=clean-sessions-task.js.map