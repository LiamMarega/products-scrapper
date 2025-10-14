"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = runMigrations;
exports.revertLastMigration = revertLastMigration;
exports.generateMigration = generateMigration;
/* eslint-disable no-console */
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const picocolors_1 = __importDefault(require("picocolors"));
const typeorm_1 = require("typeorm");
const MysqlDriver_1 = require("typeorm/driver/mysql/MysqlDriver");
const StringUtils_1 = require("typeorm/util/StringUtils");
const bootstrap_1 = require("./bootstrap");
const config_helpers_1 = require("./config/config-helpers");
/**
 * @description
 * Runs any pending database migrations. See [TypeORM migration docs](https://typeorm.io/#/migrations)
 * for more information about the underlying migration mechanism.
 *
 * @docsCategory migration
 */
async function runMigrations(userConfig) {
    const config = await (0, bootstrap_1.preBootstrapConfig)(userConfig);
    const connection = await (0, typeorm_1.createConnection)(createConnectionOptions(config));
    const migrationsRan = [];
    try {
        const migrations = await disableForeignKeysForSqLite(connection, () => connection.runMigrations({ transaction: 'each' }));
        for (const migration of migrations) {
            log(picocolors_1.default.green(`Successfully ran migration: ${migration.name}`));
            migrationsRan.push(migration.name);
        }
    }
    catch (e) {
        log(picocolors_1.default.red('An error occurred when running migrations:'));
        log(e.message);
        if (isRunningFromVendureCli()) {
            throw e;
        }
        else {
            process.exitCode = 1;
        }
    }
    finally {
        await checkMigrationStatus(connection);
        await connection.close();
        (0, config_helpers_1.resetConfig)();
    }
    return migrationsRan;
}
async function checkMigrationStatus(connection) {
    const builderLog = await connection.driver.createSchemaBuilder().log();
    if (builderLog.upQueries.length) {
        log(picocolors_1.default.yellow('Your database schema does not match your current configuration. Generate a new migration for the following changes:'));
        for (const query of builderLog.upQueries) {
            log(' - ' + picocolors_1.default.yellow(query.query));
        }
    }
}
/**
 * @description
 * Reverts the last applied database migration. See [TypeORM migration docs](https://typeorm.io/#/migrations)
 * for more information about the underlying migration mechanism.
 *
 * @docsCategory migration
 */
async function revertLastMigration(userConfig) {
    const config = await (0, bootstrap_1.preBootstrapConfig)(userConfig);
    const connection = await (0, typeorm_1.createConnection)(createConnectionOptions(config));
    try {
        await disableForeignKeysForSqLite(connection, () => connection.undoLastMigration({ transaction: 'each' }));
    }
    catch (e) {
        log(picocolors_1.default.red('An error occurred when reverting migration:'));
        log(e.message);
        if (isRunningFromVendureCli()) {
            throw e;
        }
        else {
            process.exitCode = 1;
        }
    }
    finally {
        await connection.close();
        (0, config_helpers_1.resetConfig)();
    }
}
/**
 * @description
 * Generates a new migration file based on any schema changes (e.g. adding or removing CustomFields).
 * See [TypeORM migration docs](https://typeorm.io/#/migrations) for more information about the
 * underlying migration mechanism.
 *
 * @docsCategory migration
 */
async function generateMigration(userConfig, options) {
    const config = await (0, bootstrap_1.preBootstrapConfig)(userConfig);
    const connection = await (0, typeorm_1.createConnection)(createConnectionOptions(config));
    // TODO: This can hopefully be simplified if/when TypeORM exposes this CLI command directly.
    // See https://github.com/typeorm/typeorm/issues/4494
    const sqlInMemory = await connection.driver.createSchemaBuilder().log();
    const upSqls = [];
    const downSqls = [];
    let migrationName;
    // mysql is exceptional here because it uses ` character in to escape names in queries, that's why for mysql
    // we are using simple quoted string instead of template string syntax
    if (connection.driver instanceof MysqlDriver_1.MysqlDriver) {
        sqlInMemory.upQueries.forEach(upQuery => {
            upSqls.push('        await queryRunner.query("' +
                upQuery.query.replace(new RegExp('"', 'g'), '\\"') +
                '", ' +
                JSON.stringify(upQuery.parameters) +
                ');');
        });
        sqlInMemory.downQueries.forEach(downQuery => {
            downSqls.push('        await queryRunner.query("' +
                downQuery.query.replace(new RegExp('"', 'g'), '\\"') +
                '", ' +
                JSON.stringify(downQuery.parameters) +
                ');');
        });
    }
    else {
        sqlInMemory.upQueries.forEach(upQuery => {
            upSqls.push('        await queryRunner.query(`' +
                upQuery.query.replace(new RegExp('`', 'g'), '\\`') +
                '`, ' +
                JSON.stringify(upQuery.parameters) +
                ');');
        });
        sqlInMemory.downQueries.forEach(downQuery => {
            downSqls.push('        await queryRunner.query(`' +
                downQuery.query.replace(new RegExp('`', 'g'), '\\`') +
                '`, ' +
                JSON.stringify(downQuery.parameters) +
                ');');
        });
    }
    if (upSqls.length) {
        if (options.name) {
            const timestamp = new Date().getTime();
            const filename = timestamp.toString() + '-' + options.name + '.ts';
            const directory = options.outputDir;
            const fileContent = getTemplate(options.name, timestamp, upSqls, downSqls.reverse());
            const outputPath = directory
                ? path_1.default.join(directory, filename)
                : path_1.default.join(process.cwd(), filename);
            await fs_extra_1.default.ensureFile(outputPath);
            fs_extra_1.default.writeFileSync(outputPath, fileContent);
            log(picocolors_1.default.green(`Migration ${picocolors_1.default.blue(outputPath)} has been generated successfully.`));
            migrationName = outputPath;
        }
    }
    else {
        log(picocolors_1.default.yellow('No changes in database schema were found - cannot generate a migration.'));
    }
    await connection.close();
    (0, config_helpers_1.resetConfig)();
    return migrationName;
}
function createConnectionOptions(userConfig) {
    return Object.assign({ logging: ['query', 'error', 'schema'] }, userConfig.dbConnectionOptions, {
        subscribers: [],
        synchronize: false,
        migrationsRun: false,
        dropSchema: false,
        logger: 'advanced-console',
    });
}
/**
 * There is a bug in TypeORM which causes db schema changes to fail with SQLite. This
 * is a work-around for the issue.
 * See https://github.com/typeorm/typeorm/issues/2576#issuecomment-499506647
 */
async function disableForeignKeysForSqLite(connection, work) {
    const isSqLite = connection.options.type === 'sqlite' || connection.options.type === 'better-sqlite3';
    if (isSqLite) {
        await connection.query('PRAGMA foreign_keys=OFF');
    }
    const result = await work();
    if (isSqLite) {
        await connection.query('PRAGMA foreign_keys=ON');
    }
    return result;
}
/**
 * Gets contents of the migration file.
 */
function getTemplate(name, timestamp, upSqls, downSqls) {
    return `import {MigrationInterface, QueryRunner} from "typeorm";

export class ${(0, StringUtils_1.camelCase)(name, true)}${timestamp} implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
${upSqls.join(`
`)}
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
${downSqls.join(`
`)}
   }

}
`;
}
function log(message) {
    // If running from within the Vendure CLI, we allow the CLI app
    // to handle the logging.
    if (isRunningFromVendureCli()) {
        return;
    }
    console.log(message);
}
function isRunningFromVendureCli() {
    return process.env.VENDURE_RUNNING_IN_CLI != null;
}
//# sourceMappingURL=migrate.js.map