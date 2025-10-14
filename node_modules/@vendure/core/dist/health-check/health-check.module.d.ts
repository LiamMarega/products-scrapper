import { ConfigService } from '../config/config.service';
import { HealthCheckRegistryService } from './health-check-registry.service';
export declare class HealthCheckModule {
    private configService;
    private healthCheckRegistryService;
    constructor(configService: ConfigService, healthCheckRegistryService: HealthCheckRegistryService);
}
