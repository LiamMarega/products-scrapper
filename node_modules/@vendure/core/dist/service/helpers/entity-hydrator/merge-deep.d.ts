/**
 * Merges properties into a target entity. This is needed for the cases in which a
 * property already exists on the target, but the hydrated version also contains that
 * property with a different set of properties. This prevents the original target
 * entity from having data overwritten.
 */
export declare function mergeDeep<T extends {
    [key: string]: any;
}>(a: T | undefined, b: T, visited?: WeakSet<object>): T;
