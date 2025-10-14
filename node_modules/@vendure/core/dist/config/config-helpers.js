"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetConfig = resetConfig;
exports.setConfig = setConfig;
exports.ensureConfigLoaded = ensureConfigLoaded;
exports.getConfig = getConfig;
const path_1 = __importDefault(require("path"));
const merge_config_1 = require("./merge-config");
let activeConfig;
const defaultConfigPath = path_1.default.join(__dirname, 'default-config');
/**
 * Reset the activeConfig object back to the initial default state.
 */
function resetConfig() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    activeConfig = require(defaultConfigPath).defaultConfig;
}
/**
 * Override the default config by merging in the supplied values. Should only be used prior to
 * bootstrapping the app.
 */
async function setConfig(userConfig) {
    if (!activeConfig) {
        activeConfig = (await import(defaultConfigPath)).defaultConfig;
    }
    activeConfig = (0, merge_config_1.mergeConfig)(activeConfig, userConfig);
}
/**
 * Ensures that the config has been loaded. This is necessary for tests which
 * do not go through the normal bootstrap process.
 */
async function ensureConfigLoaded() {
    if (!activeConfig) {
        activeConfig = (await import(defaultConfigPath)).defaultConfig;
    }
}
/**
 * Returns the app config object. In general this function should only be
 * used before bootstrapping the app. In all other contexts, the {@link ConfigService}
 * should be used to access config settings.
 */
function getConfig() {
    if (!activeConfig) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            activeConfig = require(defaultConfigPath).defaultConfig;
        }
        catch (e) {
            // eslint-disable-next-line no-console
            console.log('Error loading config. If this is a test, make sure you have called ensureConfigLoaded() before using the config.');
        }
    }
    return activeConfig;
}
//# sourceMappingURL=config-helpers.js.map