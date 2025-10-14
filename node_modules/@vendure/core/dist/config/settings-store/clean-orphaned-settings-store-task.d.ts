import { ScheduledTask } from '../../scheduler/scheduled-task';
/**
 * @description
 * A {@link ScheduledTask} that cleans up orphaned settings store entries from the database.
 * Orphaned entries are entries that no longer have corresponding field definitions
 * in the settings store configuration.
 *
 * This task can be configured with options for dry-run mode, age thresholds,
 * and batch processing settings. Users can override or disable this task entirely
 * using the existing ScheduledTask APIs.
 *
 * @example
 * ```ts
 * // Override the default task with custom options
 * const customCleanupTask = new ScheduledTask({
 *   id: 'clean-orphaned-settings-store',
 *   description: 'Custom orphaned settings store cleanup',
 *   schedule: cron => cron.every(7).days(),
 *   async execute({ injector }) {
 *     const settingsStoreService = injector.get(SettingsStoreService);
 *     return settingsStoreService.cleanupOrphanedEntries({
 *       olderThan: '30d',
 *       maxDeleteCount: 500,
 *       batchSize: 50,
 *     });
 *   },
 * });
 * ```
 *
 * @since 3.4.0
 * @docsCategory SettingsStore
 * @docsPage SettingsStore
 */
export declare const cleanOrphanedSettingsStoreTask: ScheduledTask<{
    olderThan: string;
}>;
