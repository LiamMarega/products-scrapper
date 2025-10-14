import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { ConfigService } from '../../config';
import { I18nError } from '../../i18n/i18n-error';
/**
 * Logs thrown I18nErrors via the configured VendureLogger.
 */
export declare class ExceptionLoggerFilter implements ExceptionFilter {
    private configService;
    constructor(configService: ConfigService);
    catch(exception: Error, host: ArgumentsHost): I18nError | undefined;
    /**
     * For a given I18nError.code, returns a corresponding HTTP
     * status code.
     */
    private errorCodeToStatusCode;
}
