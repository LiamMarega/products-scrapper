import { MiddlewareConsumer, NestModule, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { I18nService } from './i18n/i18n.service';
export declare class AppModule implements NestModule, OnApplicationShutdown {
    private configService;
    private i18nService;
    constructor(configService: ConfigService, i18nService: I18nService);
    configure(consumer: MiddlewareConsumer): void;
    onApplicationShutdown(signal?: string): Promise<void>;
    /**
     * Groups middleware handler together in an object with the route as the key.
     */
    private groupMiddlewareByRoute;
}
