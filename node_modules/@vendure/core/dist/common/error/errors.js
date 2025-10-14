"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityNotFoundError = exports.ChannelNotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.IllegalOperationError = exports.UserInputError = exports.InternalServerError = void 0;
const vendure_logger_1 = require("../../config/logger/vendure-logger");
const i18n_error_1 = require("../../i18n/i18n-error");
/**
 * @description
 * This error should be thrown when some unexpected and exceptional case is encountered.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
class InternalServerError extends i18n_error_1.I18nError {
    constructor(message, variables = {}) {
        super(message, variables, 'INTERNAL_SERVER_ERROR', vendure_logger_1.LogLevel.Error);
    }
}
exports.InternalServerError = InternalServerError;
/**
 * @description
 * This error should be thrown when user input is not as expected.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
class UserInputError extends i18n_error_1.I18nError {
    constructor(message, variables = {}) {
        super(message, variables, 'USER_INPUT_ERROR', vendure_logger_1.LogLevel.Warn);
    }
}
exports.UserInputError = UserInputError;
/**
 * @description
 * This error should be thrown when an operation is attempted which is not allowed.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
class IllegalOperationError extends i18n_error_1.I18nError {
    constructor(message, variables = {}) {
        super(message, variables, 'ILLEGAL_OPERATION', vendure_logger_1.LogLevel.Warn);
    }
}
exports.IllegalOperationError = IllegalOperationError;
/**
 * @description
 * This error should be thrown when the user's authentication credentials do not match.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
class UnauthorizedError extends i18n_error_1.I18nError {
    constructor() {
        super('error.unauthorized', {}, 'UNAUTHORIZED', vendure_logger_1.LogLevel.Info);
    }
}
exports.UnauthorizedError = UnauthorizedError;
/**
 * @description
 * This error should be thrown when a user attempts to access a resource which is outside of
 * his or her privileges.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
class ForbiddenError extends i18n_error_1.I18nError {
    constructor(logLevel = vendure_logger_1.LogLevel.Warn) {
        super('error.forbidden', {}, 'FORBIDDEN', logLevel);
    }
}
exports.ForbiddenError = ForbiddenError;
/**
 * @description
 * This error should be thrown when a {@link Channel} cannot be found based on the provided
 * channel token.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
class ChannelNotFoundError extends i18n_error_1.I18nError {
    constructor(token) {
        super('error.channel-not-found', { token }, 'CHANNEL_NOT_FOUND', vendure_logger_1.LogLevel.Info);
    }
}
exports.ChannelNotFoundError = ChannelNotFoundError;
/**
 * @description
 * This error should be thrown when an entity cannot be found in the database, i.e. no entity of
 * the given entityName (Product, User etc.) exists with the provided id.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
class EntityNotFoundError extends i18n_error_1.I18nError {
    constructor(entityName, id) {
        super('error.entity-with-id-not-found', { entityName, id }, 'ENTITY_NOT_FOUND', vendure_logger_1.LogLevel.Warn);
    }
}
exports.EntityNotFoundError = EntityNotFoundError;
//# sourceMappingURL=errors.js.map