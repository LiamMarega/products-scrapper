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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckModule = void 0;
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const config_module_1 = require("../config/config.module");
const config_service_1 = require("../config/config.service");
const job_queue_module_1 = require("../job-queue/job-queue.module");
const health_check_registry_service_1 = require("./health-check-registry.service");
const health_check_controller_1 = require("./health-check.controller");
const http_health_check_strategy_1 = require("./http-health-check-strategy");
let HealthCheckModule = class HealthCheckModule {
    constructor(configService, healthCheckRegistryService) {
        this.configService = configService;
        this.healthCheckRegistryService = healthCheckRegistryService;
        // Register all configured health checks
        for (const strategy of this.configService.systemOptions.healthChecks) {
            this.healthCheckRegistryService.registerIndicatorFunction(strategy.getHealthIndicator());
        }
    }
};
exports.HealthCheckModule = HealthCheckModule;
exports.HealthCheckModule = HealthCheckModule = __decorate([
    (0, common_1.Module)({
        imports: [terminus_1.TerminusModule, config_module_1.ConfigModule, job_queue_module_1.JobQueueModule],
        controllers: [health_check_controller_1.HealthController],
        providers: [health_check_registry_service_1.HealthCheckRegistryService, http_health_check_strategy_1.CustomHttpHealthIndicator],
        exports: [health_check_registry_service_1.HealthCheckRegistryService],
    }),
    __metadata("design:paramtypes", [config_service_1.ConfigService,
        health_check_registry_service_1.HealthCheckRegistryService])
], HealthCheckModule);
//# sourceMappingURL=health-check.module.js.map