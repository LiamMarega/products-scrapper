import { PartialVendureConfig, RuntimeVendureConfig } from './vendure-config';
/**
 * Reset the activeConfig object back to the initial default state.
 */
export declare function resetConfig(): void;
/**
 * Override the default config by merging in the supplied values. Should only be used prior to
 * bootstrapping the app.
 */
export declare function setConfig(userConfig: PartialVendureConfig): Promise<void>;
/**
 * Ensures that the config has been loaded. This is necessary for tests which
 * do not go through the normal bootstrap process.
 */
export declare function ensureConfigLoaded(): Promise<void>;
/**
 * Returns the app config object. In general this function should only be
 * used before bootstrapping the app. In all other contexts, the {@link ConfigService}
 * should be used to access config settings.
 */
export declare function getConfig(): Readonly<RuntimeVendureConfig>;
