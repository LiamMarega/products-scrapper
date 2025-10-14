import { OnModuleInit } from '@nestjs/common';
import { Handler, Request } from 'express';
import { GraphQLError } from 'graphql';
import { TFunction } from 'i18next';
import { GraphQLErrorResult } from '../common/error/error-result';
import { ConfigService } from '../config/config.service';
/**
 * @description
 * I18n resources used for translations
 *
 * @docsCategory common
 * @docsPage I18nService
 */
export interface VendureTranslationResources {
    error: any;
    errorResult: any;
    message: any;
}
export interface I18nRequest extends Request {
    t: TFunction;
}
/**
 * This service is responsible for translating messages from the server before they reach the client.
 * The `i18next-express-middleware` middleware detects the client's preferred language based on
 * the `Accept-Language` header or "lang" query param and adds language-specific translation
 * functions to the Express request / response objects.
 *
 * @docsCategory common
 * @docsPage I18nService
 * @docsWeight 0
 */
export declare class I18nService implements OnModuleInit {
    private configService;
    /**
     * @internal
     * @param configService
     */
    constructor(configService: ConfigService);
    /**
     * @internal
     */
    onModuleInit(): Promise<TFunction<"translation", undefined>>;
    /**
     * @internal
     */
    handle(): Handler;
    /**
     * @description
     * Add a I18n translation by json file
     *
     * @param langKey language key of the I18n translation file
     * @param filePath path to the I18n translation file
     */
    addTranslationFile(langKey: string, filePath: string): void;
    /**
     * @description
     * Add a I18n translation (key-value) resource
     *
     * @param langKey language key of the I18n translation file
     * @param resources key-value translations
     */
    addTranslation(langKey: string, resources: VendureTranslationResources | any): void;
    /**
     * Translates the originalError if it is an instance of I18nError.
     * @internal
     */
    translateError(req: I18nRequest, error: GraphQLError): GraphQLError;
    /**
     * Translates the message of an ErrorResult
     * @internal
     */
    translateErrorResult(req: I18nRequest, error: GraphQLErrorResult): void;
}
