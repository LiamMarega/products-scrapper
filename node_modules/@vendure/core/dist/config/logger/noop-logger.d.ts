import { VendureLogger } from './vendure-logger';
/**
 * A logger that does not log.
 */
export declare class NoopLogger implements VendureLogger {
    debug(message: string, context?: string): void;
    error(message: string, context?: string, trace?: string): void;
    info(message: string, context?: string): void;
    verbose(message: string, context?: string): void;
    warn(message: string, context?: string): void;
}
