"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledTask = void 0;
const request_context_service_1 = require("../service/helpers/request-context/request-context.service");
const channel_service_1 = require("../service/services/channel.service");
/**
 * @description
 * Use this class to define a scheduled task that will be executed at a given cron schedule.
 *
 * @example
 * ```ts
 * import { ScheduledTask } from '\@vendure/core';
 *
 * const task = new ScheduledTask({
 *     id: 'test-job',
 *     schedule: cron => cron.every(2).minutes(),
 *     execute: async ({ injector, scheduledContext, params }) => {
 *         // some logic here
 *     },
 * });
 * ```
 *
 * @since 3.3.0
 * @docsCategory scheduled-tasks
 * @docsPage ScheduledTask
 * @docsWeight 0
 */
class ScheduledTask {
    constructor(config) {
        this.config = config;
    }
    get id() {
        return this.config.id;
    }
    get options() {
        return this.config;
    }
    async execute(injector) {
        var _a;
        const requestContextService = injector.get(request_context_service_1.RequestContextService);
        const channelService = injector.get(channel_service_1.ChannelService);
        const defaultChannel = await channelService.getDefaultChannel();
        const scheduledContext = await requestContextService.create({
            apiType: 'admin',
            channelOrToken: defaultChannel,
        });
        return this.config.execute({
            injector,
            scheduledContext,
            params: (_a = this.config.params) !== null && _a !== void 0 ? _a : {},
        });
    }
    /**
     * @description
     * This method allows you to further configure existing scheduled tasks. For example, you may
     * wish to change the schedule or timeout of a task, without having to define a new task.
     *
     * @example
     * ```ts
     * import { ScheduledTask } from '\@vendure/core';
     *
     * const task = new ScheduledTask({
     *     id: 'test-job',
     *     schedule: cron => cron.every(2).minutes(),
     *     execute: async ({ injector, scheduledContext, params }) => {
     *         // some logic here
     *     },
     * });
     *
     * // later, you can configure the task
     * task.configure({ schedule: cron => cron.every(5).minutes() });
     * ```
     */
    configure(additionalConfig) {
        if (additionalConfig.schedule) {
            this.config.schedule = additionalConfig.schedule;
        }
        if (additionalConfig.timeout) {
            this.config.timeout = additionalConfig.timeout;
        }
        if (additionalConfig.params) {
            this.config.params = additionalConfig.params;
        }
        return this;
    }
}
exports.ScheduledTask = ScheduledTask;
//# sourceMappingURL=scheduled-task.js.map