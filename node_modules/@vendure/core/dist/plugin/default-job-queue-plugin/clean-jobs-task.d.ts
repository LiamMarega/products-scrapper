import { ScheduledTask } from '../../scheduler/scheduled-task';
/**
 * @description
 * A {@link ScheduledTask} that cleans up old jobs from the database when using the DefaultJobQueuePlugin.
 * You can configure the settings & schedule of the task via the {@link DefaultJobQueuePlugin} options.
 *
 * @since 3.3.0
 * @docsCategory JobQueue
 * @docsPage DefaultJobQueuePlugin
 */
export declare const cleanJobsTask: ScheduledTask<Record<string, any>>;
