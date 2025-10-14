import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IdCodecService } from '../common/id-codec.service';
export declare const ID_CODEC_TRANSFORM_KEYS = "idCodecTransformKeys";
/**
 * This interceptor automatically decodes incoming requests so that any
 * ID values are transformed correctly as per the configured EntityIdStrategy.
 *
 * ID values are defined as properties with the name "id", or properties with names matching any
 * arguments passed to the {@link Decode} decorator.
 */
export declare class IdInterceptor implements NestInterceptor {
    private idCodecService;
    private graphQlValueTransformers;
    constructor(idCodecService: IdCodecService);
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>;
    private getTransformerForSchema;
    private decodeIdArguments;
}
