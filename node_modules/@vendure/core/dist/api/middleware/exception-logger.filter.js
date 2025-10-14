"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionLoggerFilter = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("../../config");
const constants_1 = require("../../health-check/constants");
const i18n_error_1 = require("../../i18n/i18n-error");
const parse_context_1 = require("../common/parse-context");
/**
 * Logs thrown I18nErrors via the configured VendureLogger.
 */
let ExceptionLoggerFilter = class ExceptionLoggerFilter {
    constructor(configService) {
        this.configService = configService;
    }
    catch(exception, host) {
        for (const handler of this.configService.systemOptions.errorHandlers) {
            void handler.handleServerError(exception, { host });
        }
        const { req, res, info, isGraphQL } = (0, parse_context_1.parseContext)(host);
        let message = '';
        let statusCode = 500;
        if (exception instanceof i18n_error_1.I18nError) {
            const { code, message: msg, logLevel } = exception;
            message = `${code || 'Error'}: ${msg}`;
            statusCode = this.errorCodeToStatusCode(code);
            switch (logLevel) {
                case config_1.LogLevel.Error:
                    config_1.Logger.error(JSON.stringify({ message, variables: exception.variables }, null, 2), undefined, exception.stack);
                    break;
                case config_1.LogLevel.Warn:
                    config_1.Logger.warn(message);
                    break;
                case config_1.LogLevel.Info:
                    config_1.Logger.info(message);
                    break;
                case config_1.LogLevel.Debug:
                    config_1.Logger.debug(message);
                    break;
                case config_1.LogLevel.Verbose:
                    config_1.Logger.verbose(message);
                    break;
            }
            if (exception.stack) {
                config_1.Logger.debug(exception.stack);
            }
            if (isGraphQL) {
                return exception;
            }
        }
        else if (exception instanceof common_1.HttpException) {
            // Handle other Nestjs errors
            statusCode = exception.getStatus();
            message = exception.message;
            if (statusCode === 404) {
                config_1.Logger.verbose(exception.message);
            }
            else {
                config_1.Logger.error(message, undefined, exception.stack);
            }
        }
        else {
            config_1.Logger.error(exception.message, undefined, exception.stack);
        }
        if (exception instanceof common_1.HttpException && req.path.startsWith('/' + constants_1.HEALTH_CHECK_ROUTE)) {
            // Special case for the health check error, since we want to display the response only
            // so it matches the format of the success case.
            res.status(exception.getStatus()).send(exception.getResponse());
        }
        else if (!isGraphQL) {
            // In the GraphQL context, we can let the error pass
            // through to the next layer, where Apollo Server will
            // return a response for us. But when in the REST context,
            // we must explicitly send the response, otherwise the server
            // will hang.
            res.status(statusCode).json({
                statusCode,
                message,
                timestamp: new Date().toISOString(),
                path: req.url,
            });
        }
    }
    /**
     * For a given I18nError.code, returns a corresponding HTTP
     * status code.
     */
    errorCodeToStatusCode(errorCode) {
        switch (errorCode) {
            case 'FORBIDDEN':
                return 403;
            case 'UNAUTHORIZED':
                return 401;
            case 'USER_INPUT_ERROR':
            case 'ILLEGAL_OPERATION':
                return 400;
            default:
                return 500;
        }
    }
};
exports.ExceptionLoggerFilter = ExceptionLoggerFilter;
exports.ExceptionLoggerFilter = ExceptionLoggerFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ExceptionLoggerFilter);
//# sourceMappingURL=exception-logger.filter.js.map