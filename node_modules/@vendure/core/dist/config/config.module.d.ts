import { OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ConfigService } from './config.service';
export declare class ConfigModule implements OnApplicationBootstrap, OnApplicationShutdown {
    private configService;
    private moduleRef;
    constructor(configService: ConfigService, moduleRef: ModuleRef);
    onApplicationBootstrap(): Promise<void>;
    onApplicationShutdown(signal?: string): Promise<void>;
    private initInjectableStrategies;
    private destroyInjectableStrategies;
    private initConfigurableOperations;
    private destroyConfigurableOperations;
    private getInjectableStrategies;
    private getConfigurableOperations;
}
