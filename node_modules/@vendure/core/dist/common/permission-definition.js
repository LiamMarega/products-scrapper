"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudPermissionDefinition = exports.PermissionDefinition = void 0;
/**
 * @description
 * Defines a new Permission with which to control access to GraphQL resolvers & REST controllers.
 * Used in conjunction with the {@link Allow} decorator (see example below).
 *
 * **Note:** To define CRUD permissions, use the {@link CrudPermissionDefinition}.
 *
 * @example
 * ```ts
 * export const sync = new PermissionDefinition({
 *   name: 'SyncInventory',
 *   description: 'Allows syncing stock levels via Admin API'
 * });
 * ```
 *
 * ```ts
 * const config: VendureConfig = {
 *   authOptions: {
 *     customPermissions: [sync],
 *   },
 * }
 * ```
 *
 * ```ts
 * \@Resolver()
 * export class ExternalSyncResolver {
 *
 *   \@Allow(sync.Permission)
 *   \@Mutation()
 *   syncStockLevels() {
 *     // ...
 *   }
 * }
 * ```
 * @docsCategory auth
 * @docsPage PermissionDefinition
 * @docsWeight 0
 */
class PermissionDefinition {
    constructor(config) {
        this.config = config;
    }
    /** @internal */
    getMetadata() {
        const { name, description, assignable, internal } = this.config;
        return [
            {
                name,
                description: description || `Grants permissions on ${name} operations`,
                assignable: assignable !== null && assignable !== void 0 ? assignable : true,
                internal: internal !== null && internal !== void 0 ? internal : false,
            },
        ];
    }
    /**
     * @description
     * Returns the permission defined by this definition, for use in the
     * {@link Allow} decorator.
     */
    get Permission() {
        return this.config.name;
    }
}
exports.PermissionDefinition = PermissionDefinition;
/**
 * @description
 * Defines a set of CRUD Permissions for the given name, i.e. a `name` of 'Wishlist' will create
 * 4 Permissions: 'CreateWishlist', 'ReadWishlist', 'UpdateWishlist' & 'DeleteWishlist'.
 *
 * @example
 * ```ts
 * export const wishlist = new CrudPermissionDefinition('Wishlist');
 * ```
 *
 * ```ts
 * const config: VendureConfig = {
 *   authOptions: {
 *     customPermissions: [wishlist],
 *   },
 * }
 * ```
 *
 * ```ts
 * \@Resolver()
 * export class WishlistResolver {
 *
 *   \@Allow(wishlist.Create)
 *   \@Mutation()
 *   createWishlist() {
 *     // ...
 *   }
 * }
 * ```
 *
 * @docsCategory auth
 * @docsPage PermissionDefinition
 * @docsWeight 1
 */
class CrudPermissionDefinition extends PermissionDefinition {
    constructor(name, descriptionFn) {
        super({ name });
        this.descriptionFn = descriptionFn;
    }
    /** @internal */
    getMetadata() {
        return ['Create', 'Read', 'Update', 'Delete'].map(operation => ({
            name: `${operation}${this.config.name}`,
            description: typeof this.descriptionFn === 'function'
                ? this.descriptionFn(operation.toLocaleLowerCase())
                : `Grants permission to ${operation.toLocaleLowerCase()} ${this.config.name}`,
            assignable: true,
            internal: false,
        }));
    }
    /**
     * @description
     * Returns the 'Create' CRUD permission defined by this definition, for use in the
     * {@link Allow} decorator.
     */
    get Create() {
        return `Create${this.config.name}`;
    }
    /**
     * @description
     * Returns the 'Read' CRUD permission defined by this definition, for use in the
     * {@link Allow} decorator.
     */
    get Read() {
        return `Read${this.config.name}`;
    }
    /**
     * @description
     * Returns the 'Update' CRUD permission defined by this definition, for use in the
     * {@link Allow} decorator.
     */
    get Update() {
        return `Update${this.config.name}`;
    }
    /**
     * @description
     * Returns the 'Delete' CRUD permission defined by this definition, for use in the
     * {@link Allow} decorator.
     */
    get Delete() {
        return `Delete${this.config.name}`;
    }
}
exports.CrudPermissionDefinition = CrudPermissionDefinition;
//# sourceMappingURL=permission-definition.js.map