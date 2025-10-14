import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { I18nService } from '../../i18n/i18n.service';
/**
 * @description
 * Translates any top-level ErrorResult message
 */
export declare class TranslateErrorResultInterceptor implements NestInterceptor {
    private i18nService;
    constructor(i18nService: I18nService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private translateResult;
}
