import { VendureConfig } from '../config/vendure-config';
/**
 * Dynamically registers any custom fields with TypeORM. This function should be run at the bootstrap
 * stage of the app lifecycle, before the AppModule is initialized.
 */
export declare function registerCustomEntityFields(config: VendureConfig): void;
