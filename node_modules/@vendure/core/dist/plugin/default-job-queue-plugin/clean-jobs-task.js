"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanJobsTask = void 0;
const config_1 = require("../../config");
const connection_1 = require("../../connection");
const scheduled_task_1 = require("../../scheduler/scheduled-task");
const constants_1 = require("./constants");
const job_record_entity_1 = require("./job-record.entity");
/**
 * @description
 * A {@link ScheduledTask} that cleans up old jobs from the database when using the DefaultJobQueuePlugin.
 * You can configure the settings & schedule of the task via the {@link DefaultJobQueuePlugin} options.
 *
 * @since 3.3.0
 * @docsCategory JobQueue
 * @docsPage DefaultJobQueuePlugin
 */
exports.cleanJobsTask = new scheduled_task_1.ScheduledTask({
    id: 'clean-jobs',
    description: 'Clean completed, failed, and cancelled jobs from the database',
    schedule: cron => cron.every(2).hours(),
    async execute({ injector, params }) {
        const options = injector.get(constants_1.DEFAULT_JOB_QUEUE_PLUGIN_OPTIONS);
        const keepJobsCount = options.keepJobsCount || constants_1.DEFAULT_KEEP_JOBS_COUNT;
        const connection = injector.get(connection_1.TransactionalConnection);
        const qb = connection.rawConnection
            .getRepository(job_record_entity_1.JobRecord)
            .createQueryBuilder('job')
            .where(`job.state IN (:...states)`, {
            states: ['COMPLETED', 'FAILED', 'CANCELLED'],
        })
            .orderBy('job.createdAt', 'ASC');
        const count = await qb.getCount();
        const BATCH_SIZE = 100;
        const numberOfJobsToDelete = Math.max(count - keepJobsCount, 0);
        if (0 < numberOfJobsToDelete) {
            const jobsToDelete = await qb.select('id').limit(numberOfJobsToDelete).getRawMany();
            config_1.Logger.verbose(`Cleaning up ${jobsToDelete.length} jobs...`);
            for (let i = 0; i < jobsToDelete.length; i += BATCH_SIZE) {
                const batch = jobsToDelete.slice(i, i + BATCH_SIZE);
                await connection.rawConnection
                    .getRepository(job_record_entity_1.JobRecord)
                    .delete(batch.map(job => job.id));
            }
        }
        return {
            jobRecordsDeleted: numberOfJobsToDelete,
        };
    },
});
//# sourceMappingURL=clean-jobs-task.js.map