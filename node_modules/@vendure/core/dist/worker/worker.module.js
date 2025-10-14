"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerModule = void 0;
const common_1 = require("@nestjs/common");
const config_module_1 = require("../config/config.module");
const vendure_logger_1 = require("../config/logger/vendure-logger");
const connection_module_1 = require("../connection/connection.module");
const i18n_module_1 = require("../i18n/i18n.module");
const plugin_module_1 = require("../plugin/plugin.module");
const process_context_module_1 = require("../process-context/process-context.module");
const service_module_1 = require("../service/service.module");
const worker_health_service_1 = require("./worker-health.service");
/**
 * This is the main module used when bootstrapping the worker process via
 * `bootstrapWorker()`. It contains the same imports as the AppModule except
 * for the ApiModule, which is not needed for the worker. Omitting the ApiModule
 * greatly increases startup time (about 4x in testing).
 */
let WorkerModule = class WorkerModule {
    async onApplicationShutdown(signal) {
        if (signal) {
            vendure_logger_1.Logger.info('Received shutdown signal:' + signal);
        }
    }
};
exports.WorkerModule = WorkerModule;
exports.WorkerModule = WorkerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            process_context_module_1.ProcessContextModule,
            config_module_1.ConfigModule,
            i18n_module_1.I18nModule,
            plugin_module_1.PluginModule.forRoot(),
            connection_module_1.ConnectionModule.forRoot(),
            service_module_1.ServiceModule,
        ],
        providers: [worker_health_service_1.WorkerHealthService],
    })
], WorkerModule);
//# sourceMappingURL=worker.module.js.map