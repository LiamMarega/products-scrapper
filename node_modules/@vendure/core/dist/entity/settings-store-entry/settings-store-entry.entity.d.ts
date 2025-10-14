import { VendureEntity } from '../base/base.entity';
/**
 * @description
 * An entity for storing arbitrary settings data with scoped isolation.
 * This is used by the SettingsStore system to provide flexible key-value storage
 * with support for user, channel, and custom scoping.
 *
 * @docsCategory entities
 * @docsPage SettingsStoreEntry
 * @since 3.4.0
 */
export declare class SettingsStoreEntry extends VendureEntity {
    constructor(input?: Partial<SettingsStoreEntry>);
    /**
     * @description
     * The settings key, typically in the format 'namespace.fieldName'
     */
    key: string;
    /**
     * @description
     * The JSON value stored for this setting
     */
    value: any | null;
    /**
     * @description
     * The scope string that isolates this setting (e.g., 'user:123', 'channel:456', '')
     */
    scope: string | null;
}
