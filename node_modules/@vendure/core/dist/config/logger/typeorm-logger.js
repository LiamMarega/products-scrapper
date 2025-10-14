"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmLogger = void 0;
const vendure_logger_1 = require("./vendure-logger");
const context = 'TypeORM';
const defaultLoggerOptions = ['error', 'warn', 'schema', 'migration'];
/**
 * A custom logger for TypeORM which delegates to the Vendure Logger service.
 */
class TypeOrmLogger {
    constructor(options = defaultLoggerOptions) {
        this.options = options;
    }
    log(level, message, queryRunner) {
        switch (level) {
            case 'info':
                if (this.shouldDisplay('info')) {
                    vendure_logger_1.Logger.info(message, context);
                }
                break;
            case 'log':
                if (this.shouldDisplay('log')) {
                    vendure_logger_1.Logger.info(message, context);
                }
                break;
            case 'warn':
                if (this.shouldDisplay('warn')) {
                    vendure_logger_1.Logger.warn(message, context);
                }
                break;
        }
    }
    logMigration(message, queryRunner) {
        vendure_logger_1.Logger.info(message, context);
    }
    logQuery(query, parameters, queryRunner) {
        if (this.shouldDisplay('query')) {
            const sql = this.formatQueryWithParams(query, parameters);
            vendure_logger_1.Logger.debug(`Query: ${sql}`, context);
        }
    }
    logQueryError(error, query, parameters, queryRunner) {
        if (this.shouldDisplay('error')) {
            const sql = this.formatQueryWithParams(query, parameters);
            vendure_logger_1.Logger.error(`Query error: ${sql}`, context);
            vendure_logger_1.Logger.verbose(error, context);
        }
    }
    logQuerySlow(time, query, parameters, queryRunner) {
        const sql = this.formatQueryWithParams(query, parameters);
        vendure_logger_1.Logger.warn('Query is slow: ' + sql);
        vendure_logger_1.Logger.warn('Execution time: ' + time.toString());
    }
    logSchemaBuild(message, queryRunner) {
        if (this.shouldDisplay('schema')) {
            vendure_logger_1.Logger.info(message, context);
        }
    }
    shouldDisplay(logType) {
        return (this.options === 'all' ||
            this.options === true ||
            (Array.isArray(this.options) && this.options.includes(logType)));
    }
    formatQueryWithParams(query, parameters) {
        return (query +
            ((parameters === null || parameters === void 0 ? void 0 : parameters.length) ? ' -- PARAMETERS: ' + this.stringifyParams(parameters).toString() : ''));
    }
    /**
     * Converts parameters to a string.
     * Sometimes parameters can have circular objects and therefor we are handle this case too.
     */
    stringifyParams(parameters) {
        try {
            return JSON.stringify(parameters);
        }
        catch (error) {
            // most probably circular objects in parameters
            return parameters;
        }
    }
}
exports.TypeOrmLogger = TypeOrmLogger;
//# sourceMappingURL=typeorm-logger.js.map