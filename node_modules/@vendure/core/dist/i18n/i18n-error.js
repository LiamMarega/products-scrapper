"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18nError = void 0;
const graphql_1 = require("graphql");
const vendure_logger_1 = require("../config/logger/vendure-logger");
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
class I18nError extends graphql_1.GraphQLError {
    constructor(message, variables = {}, code, logLevel = vendure_logger_1.LogLevel.Warn) {
        super(message, {
            extensions: { code },
        });
        this.message = message;
        this.variables = variables;
        this.code = code;
        this.logLevel = logLevel;
    }
}
exports.I18nError = I18nError;
//# sourceMappingURL=i18n-error.js.map