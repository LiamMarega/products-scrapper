import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ConfigService } from '../../config/config.service';
/**
 * @description
 * Unified interceptor that processes custom fields in GraphQL mutations by:
 *
 * 1. Applying default values when fields are explicitly set to null (create operations only)
 * 2. Validating custom field values according to their constraints
 *
 * Uses native GraphQL utilities (visit, visitWithTypeInfo, getNamedType) for efficient
 * AST traversal and type analysis.
 */
export declare class CustomFieldProcessingInterceptor implements NestInterceptor {
    private readonly configService;
    private readonly moduleRef;
    private readonly createInputsWithCustomFields;
    private readonly updateInputsWithCustomFields;
    constructor(configService: ConfigService, moduleRef: ModuleRef);
    intercept(context: ExecutionContext, next: CallHandler<any>): Promise<import("rxjs").Observable<any>>;
    private processMutationCustomFields;
    private hasCustomFields;
    private processInputVariables;
    private shouldApplyDefaults;
    private isOrderLineCreateOperation;
    private getArgumentMap;
    private applyDefaultsToInput;
    private applyDefaultsForOrderLine;
    private applyDefaultsForEntity;
    private applyDefaultsToDirectCustomFields;
    private applyDefaultsToTranslationCustomFields;
    private applyDefaultsToCustomFieldsObject;
    private getEntityNameFromInputType;
    private validateInput;
    private validateCustomFieldsObject;
}
