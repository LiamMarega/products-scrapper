import { LoggerService } from '@nestjs/common';
/**
 * @description
 * An enum of valid logging levels.
 *
 * @docsCategory Logger
 */
export declare enum LogLevel {
    /**
     * @description
     * Log Errors only. These are usually indicative of some potentially
     * serious issue, so should be acted upon.
     */
    Error = 0,
    /**
     * @description
     * Warnings indicate that some situation may require investigation
     * and handling. But not as serious as an Error.
     */
    Warn = 1,
    /**
     * @description
     * Logs general information such as startup messages.
     */
    Info = 2,
    /**
     * @description
     * Logs additional information
     */
    Verbose = 3,
    /**
     * @description
     * Logs detailed info useful in debug scenarios, including stack traces for
     * all errors. In production this would probably generate too much noise.
     */
    Debug = 4
}
/**
 * @description
 * The VendureLogger interface defines the shape of a logger service which may be provided in
 * the config.
 *
 * @docsCategory Logger
 */
export interface VendureLogger {
    error(message: string, context?: string, trace?: string): void;
    warn(message: string, context?: string): void;
    info(message: string, context?: string): void;
    verbose(message: string, context?: string): void;
    debug(message: string, context?: string): void;
    setDefaultContext?(defaultContext: string): void;
}
/**
 * @description
 * The Logger is responsible for all logging in a Vendure application.
 *
 * It is intended to be used as a static class:
 *
 * @example
 * ```ts
 * import { Logger } from '\@vendure/core';
 *
 * Logger.info(`Some log message`, 'My Vendure Plugin');
 * ```
 *
 * The actual implementation - where the logs are written to - is defined by the {@link VendureLogger}
 * instance configured in the {@link VendureConfig}. By default, the {@link DefaultLogger} is used, which
 * logs to the console.
 *
 * ## Implementing a custom logger
 *
 * A custom logger can be passed to the `logger` config option by creating a class which implements the
 * {@link VendureLogger} interface. For example, here is how you might go about implementing a logger which
 * logs to a file:
 *
 * @example
 * ```ts
 * import { VendureLogger } from '\@vendure/core';
 * import fs from 'fs';
 *
 * // A simple custom logger which writes all logs to a file.
 * export class SimpleFileLogger implements VendureLogger {
 *     private logfile: fs.WriteStream;
 *
 *     constructor(logfileLocation: string) {
 *         this.logfile = fs.createWriteStream(logfileLocation, { flags: 'w' });
 *     }
 *
 *     error(message: string, context?: string) {
 *         this.logfile.write(`ERROR: [${context}] ${message}\n`);
 *     }
 *     warn(message: string, context?: string) {
 *         this.logfile.write(`WARN: [${context}] ${message}\n`);
 *     }
 *     info(message: string, context?: string) {
 *         this.logfile.write(`INFO: [${context}] ${message}\n`);
 *     }
 *     verbose(message: string, context?: string) {
 *         this.logfile.write(`VERBOSE: [${context}] ${message}\n`);
 *     }
 *     debug(message: string, context?: string) {
 *         this.logfile.write(`DEBUG: [${context}] ${message}\n`);
 *     }
 * }
 *
 * // in the VendureConfig
 * export const config = {
 *     // ...
 *     logger: new SimpleFileLogger('server.log'),
 * }
 * ```
 *
 * @docsCategory Logger
 */
export declare class Logger implements LoggerService {
    private static _instance;
    private static _logger;
    static get logger(): VendureLogger;
    private get instance();
    /** @internal */
    static useLogger(logger: VendureLogger): void;
    /** @internal */
    error(message: any, trace?: string, context?: string): any;
    /** @internal */
    warn(message: any, context?: string): any;
    /** @internal */
    log(message: any, context?: string): any;
    /** @internal */
    verbose(message: any, context?: string): any;
    /** @internal */
    debug(message: any, context?: string): any;
    static error(message: string, context?: string, trace?: string): void;
    static warn(message: string, context?: string): void;
    static info(message: string, context?: string): void;
    static verbose(message: string, context?: string): void;
    static debug(message: string, context?: string): void;
}
