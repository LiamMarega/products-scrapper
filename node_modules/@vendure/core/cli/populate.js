"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.populate = populate;
exports.populateInitialData = populateInitialData;
exports.populateCollections = populateCollections;
exports.importProductsFromCsv = importProductsFromCsv;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const rxjs_1 = require("rxjs");
const loggerCtx = 'Populate';
async function populate(bootstrapFn, initialDataPathOrObject, productsCsvPath, channelOrToken) {
    const app = await bootstrapFn();
    if (!app) {
        throw new Error('Could not bootstrap the Vendure app');
    }
    let channel;
    const { ChannelService, Channel, Logger } = await import('@vendure/core');
    if (typeof channelOrToken === 'string') {
        channel = await app.get(ChannelService).getChannelFromToken(channelOrToken);
        if (!channel) {
            Logger.warn(`Warning: channel with token "${channelOrToken}" was not found. Using default Channel instead.`, loggerCtx);
        }
    }
    else if (channelOrToken instanceof Channel) {
        channel = channelOrToken;
    }
    const initialData = typeof initialDataPathOrObject === 'string'
        ? require(initialDataPathOrObject)
        : initialDataPathOrObject;
    await populateInitialData(app, initialData, channel);
    if (productsCsvPath) {
        const importResult = await importProductsFromCsv(app, productsCsvPath, initialData.defaultLanguage, channel);
        if (importResult.errors && importResult.errors.length) {
            const errorFile = path_1.default.join(process.cwd(), 'vendure-import-error.log');
            Logger.error(`${importResult.errors.length} errors encountered when importing product data. See: ${errorFile}`, loggerCtx);
            await fs_extra_1.default.writeFile(errorFile, importResult.errors.join('\n'));
        }
        Logger.info(`Imported ${importResult.imported} products`, loggerCtx);
        await populateCollections(app, initialData, channel);
    }
    Logger.info('Done!', loggerCtx);
    return app;
}
async function populateInitialData(app, initialData, channel) {
    const { Populator, Logger } = await import('@vendure/core');
    const populator = app.get(Populator);
    try {
        await populator.populateInitialData(initialData, channel);
        Logger.info('Populated initial data', loggerCtx);
    }
    catch (err) {
        Logger.error(err.message, loggerCtx);
    }
}
async function populateCollections(app, initialData, channel) {
    const { Populator, Logger } = await import('@vendure/core');
    const populator = app.get(Populator);
    try {
        if (initialData.collections.length) {
            await populator.populateCollections(initialData, channel);
            Logger.info(`Created ${initialData.collections.length} Collections`, loggerCtx);
        }
    }
    catch (err) {
        Logger.info(err.message, loggerCtx);
    }
}
async function importProductsFromCsv(app, productsCsvPath, languageCode, channel) {
    const { Importer, RequestContextService } = await import('@vendure/core');
    const importer = app.get(Importer);
    const requestContextService = app.get(RequestContextService);
    const productData = await fs_extra_1.default.readFile(productsCsvPath, 'utf-8');
    const ctx = await requestContextService.create({
        apiType: 'admin',
        languageCode,
        channelOrToken: channel,
    });
    const createEnvVar = 'CREATING_VENDURE_APP';
    const reportProgress = process.env[createEnvVar] === 'true' ? false : true;
    return (0, rxjs_1.lastValueFrom)(importer.parseAndImport(productData, ctx, reportProgress));
}
//# sourceMappingURL=populate.js.map