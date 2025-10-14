"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultSchedulerPlugin = void 0;
const plugin_common_module_1 = require("../../plugin/plugin-common.module");
const vendure_plugin_1 = require("../../plugin/vendure-plugin");
const constants_1 = require("./constants");
const default_scheduler_strategy_1 = require("./default-scheduler-strategy");
const scheduled_task_record_entity_1 = require("./scheduled-task-record.entity");
const stale_task_service_1 = require("./stale-task.service");
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
let DefaultSchedulerPlugin = class DefaultSchedulerPlugin {
    static init(config) {
        this.options = Object.assign(Object.assign({}, this.options), (config || {}));
        return this;
    }
};
exports.DefaultSchedulerPlugin = DefaultSchedulerPlugin;
DefaultSchedulerPlugin.options = {
    defaultTimeout: constants_1.DEFAULT_TIMEOUT,
    manualTriggerCheckInterval: constants_1.DEFAULT_MANUAL_TRIGGER_CHECK_INTERVAL,
};
exports.DefaultSchedulerPlugin = DefaultSchedulerPlugin = __decorate([
    (0, vendure_plugin_1.VendurePlugin)({
        imports: [plugin_common_module_1.PluginCommonModule],
        entities: [scheduled_task_record_entity_1.ScheduledTaskRecord],
        configuration: config => {
            config.schedulerOptions.schedulerStrategy = new default_scheduler_strategy_1.DefaultSchedulerStrategy();
            return config;
        },
        providers: [
            {
                provide: constants_1.DEFAULT_SCHEDULER_PLUGIN_OPTIONS,
                useFactory: () => DefaultSchedulerPlugin.options,
            },
            stale_task_service_1.StaleTaskService,
        ],
        compatibility: '>0.0.0',
    })
], DefaultSchedulerPlugin);
//# sourceMappingURL=default-scheduler.plugin.js.map