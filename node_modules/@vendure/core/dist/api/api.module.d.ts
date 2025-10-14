import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
/**
 * The ApiModule is responsible for the public API of the application. This is where requests
 * come in, are parsed and then handed over to the ServiceModule classes which take care
 * of the business logic.
 */
export declare class ApiModule implements NestModule {
    private configService;
    constructor(configService: ConfigService);
    configure(consumer: MiddlewareConsumer): Promise<void>;
}
