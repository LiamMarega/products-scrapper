import { Logger as TypeOrmLoggerInterface, QueryRunner } from 'typeorm';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';
/**
 * A custom logger for TypeORM which delegates to the Vendure Logger service.
 */
export declare class TypeOrmLogger implements TypeOrmLoggerInterface {
    private options;
    constructor(options?: LoggerOptions);
    log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any;
    logMigration(message: string, queryRunner?: QueryRunner): any;
    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any;
    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any;
    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any;
    logSchemaBuild(message: string, queryRunner?: QueryRunner): any;
    private shouldDisplay;
    private formatQueryWithParams;
    /**
     * Converts parameters to a string.
     * Sometimes parameters can have circular objects and therefor we are handle this case too.
     */
    private stringifyParams;
}
