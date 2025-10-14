"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginCommonModule = void 0;
const common_1 = require("@nestjs/common");
const cache_module_1 = require("../cache/cache.module");
const config_module_1 = require("../config/config.module");
const connection_module_1 = require("../connection/connection.module");
const data_import_module_1 = require("../data-import/data-import.module");
const event_bus_module_1 = require("../event-bus/event-bus.module");
const health_check_module_1 = require("../health-check/health-check.module");
const i18n_module_1 = require("../i18n/i18n.module");
const job_queue_module_1 = require("../job-queue/job-queue.module");
const process_context_module_1 = require("../process-context/process-context.module");
const service_module_1 = require("../service/service.module");
/**
 * @description
 * This module provides the common services, configuration, and event bus capabilities
 * required by a typical plugin. It should be imported into plugins to avoid having to
 * repeat the same boilerplate for each individual plugin.
 *
 * The PluginCommonModule exports:
 *
 * * `EventBusModule`, allowing the injection of the {@link EventBus} service.
 * * `ServiceModule` allowing the injection of any of the various entity services such as ProductService, OrderService etc.
 * * `ConfigModule`, allowing the injection of the ConfigService.
 * * `JobQueueModule`, allowing the injection of the {@link JobQueueService}.
 * * `HealthCheckModule`, allowing the injection of the {@link HealthCheckRegistryService}.
 *
 * @docsCategory plugin
 */
let PluginCommonModule = class PluginCommonModule {
};
exports.PluginCommonModule = PluginCommonModule;
exports.PluginCommonModule = PluginCommonModule = __decorate([
    (0, common_1.Module)({
        imports: [
            event_bus_module_1.EventBusModule,
            config_module_1.ConfigModule,
            connection_module_1.ConnectionModule.forPlugin(),
            service_module_1.ServiceModule,
            job_queue_module_1.JobQueueModule,
            health_check_module_1.HealthCheckModule,
            cache_module_1.CacheModule,
            i18n_module_1.I18nModule,
            process_context_module_1.ProcessContextModule,
            data_import_module_1.DataImportModule,
        ],
        exports: [
            event_bus_module_1.EventBusModule,
            config_module_1.ConfigModule,
            connection_module_1.ConnectionModule.forPlugin(),
            service_module_1.ServiceModule,
            job_queue_module_1.JobQueueModule,
            health_check_module_1.HealthCheckModule,
            cache_module_1.CacheModule,
            i18n_module_1.I18nModule,
            process_context_module_1.ProcessContextModule,
            data_import_module_1.DataImportModule,
        ],
    })
], PluginCommonModule);
//# sourceMappingURL=plugin-common.module.js.map