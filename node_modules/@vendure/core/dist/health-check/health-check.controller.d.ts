import { HealthCheckService } from '@nestjs/terminus';
import { HealthCheckRegistryService } from './health-check-registry.service';
export declare class HealthController {
    private health;
    private healthCheckRegistryService;
    constructor(health: HealthCheckService, healthCheckRegistryService: HealthCheckRegistryService);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}
