/**
 * Predicate with type guard, used to filter out null or undefined values
 * in a filter operation.
 */
export declare function notNullOrUndefined<T>(val: T | undefined | null): val is T;
/**
 * Used in exhaustiveness checks to assert a codepath should never be reached.
 */
export declare function assertNever(value: never): never;
/**
 * Simple object check.
 * From https://stackoverflow.com/a/34749873/772859
 */
export declare function isObject(item: any): item is object;
export declare function isClassInstance(item: any): boolean;
type NumericPropsOf<T> = {
    [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];
type NPO<T, KT extends keyof T> = {
    [K in KT]: T[K] extends string | number | boolean ? T[K] : T[K] extends Array<infer A> ? Array<OnlyNumerics<A>> : OnlyNumerics<T[K]>;
};
type OnlyNumerics<T> = NPO<T, NumericPropsOf<T>>;
/**
 * Adds up all the values of a given numeric property of a list of objects.
 */
export declare function summate<T extends OnlyNumerics<T>>(items: T[] | undefined | null, prop: keyof OnlyNumerics<T>): number;
/**
 * Given an array of option arrays `[['red, 'blue'], ['small', 'large']]`, this method returns a new array
 * containing all the combinations of those options:
 *
 * @example
 * ```
 * generateAllCombinations([['red, 'blue'], ['small', 'large']]);
 * // =>
 * // [
 * //  ['red', 'small'],
 * //  ['red', 'large'],
 * //  ['blue', 'small'],
 * //  ['blue', 'large'],
 * // ]
 */
export declare function generateAllCombinations<T>(optionGroups: T[][], combination?: T[], k?: number, output?: T[][]): T[][];
/**
 * @description
 * Returns the input field name of a custom field, taking into account that "relation" type custom
 * field inputs are suffixed with "Id" or "Ids".
 */
export declare function getGraphQlInputName(config: {
    name: string;
    type: string;
    list?: boolean;
}): string;
export {};
