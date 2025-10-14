import { DefaultSchedulerPluginOptions } from './types';
/**
 * @description
 * This plugin configures a default scheduling strategy that executes scheduled
 * tasks using the database to ensure that each task is executed exactly once
 * at the scheduled time, even if there are multiple instances of the worker
 * running.
 *
 * @example
 * ```ts
 * import { DefaultSchedulerPlugin, VendureConfig } from '@vendure/core';
 *
 * export const config: VendureConfig = {
 *   plugins: [
 *     DefaultSchedulerPlugin.init({
 *       // The default is 60s, but you can override it here
 *       defaultTimeout: '10s',
 *     }),
 *   ],
 * };
 * ```
 *
 * @since 3.3.0
 * @docsCategory scheduled-tasks
 * @docsPage DefaultSchedulerPlugin
 * @docsWeight 0
 */
export declare class DefaultSchedulerPlugin {
    static options: DefaultSchedulerPluginOptions;
    static init(config?: DefaultSchedulerPluginOptions): typeof DefaultSchedulerPlugin;
}
