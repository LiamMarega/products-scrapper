import { GraphQLError } from 'graphql';
import { LogLevel } from '../config/logger/vendure-logger';
/**
 * @description
 * All errors thrown in the Vendure server must use or extend this error class. This allows the
 * error message to be translated before being served to the client.
 *
 * The error messages should be provided in the form of a string key which corresponds to
 * a key defined in the `i18n/messages/<languageCode>.json` files.
 *
 * Note that this class should not be directly used in code, but should be extended by
 * a more specific Error class.
 *
 * @docsCategory errors
 */
export declare abstract class I18nError extends GraphQLError {
    message: string;
    variables: {
        [key: string]: string | number;
    };
    code?: string | undefined;
    logLevel: LogLevel;
    protected constructor(message: string, variables?: {
        [key: string]: string | number;
    }, code?: string | undefined, logLevel?: LogLevel);
}
