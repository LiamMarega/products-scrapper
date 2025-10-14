import { VendureConfig } from './config/vendure-config';
/**
 * @description
 * Configuration for generating a new migration script via {@link generateMigration}.
 *
 * @docsCategory migration
 */
export interface MigrationOptions {
    /**
     * @description
     * The name of the migration. The resulting migration script will be named
     * `{TIMESTAMP}-{name}.ts`.
     */
    name: string;
    /**
     * @description
     * The output directory of the generated migration scripts.
     */
    outputDir?: string;
}
/**
 * @description
 * Runs any pending database migrations. See [TypeORM migration docs](https://typeorm.io/#/migrations)
 * for more information about the underlying migration mechanism.
 *
 * @docsCategory migration
 */
export declare function runMigrations(userConfig: Partial<VendureConfig>): Promise<string[]>;
/**
 * @description
 * Reverts the last applied database migration. See [TypeORM migration docs](https://typeorm.io/#/migrations)
 * for more information about the underlying migration mechanism.
 *
 * @docsCategory migration
 */
export declare function revertLastMigration(userConfig: Partial<VendureConfig>): Promise<void>;
/**
 * @description
 * Generates a new migration file based on any schema changes (e.g. adding or removing CustomFields).
 * See [TypeORM migration docs](https://typeorm.io/#/migrations) for more information about the
 * underlying migration mechanism.
 *
 * @docsCategory migration
 */
export declare function generateMigration(userConfig: Partial<VendureConfig>, options: MigrationOptions): Promise<string | undefined>;
