/**
 * An extremely fast function for deep-cloning an object which only contains simple
 * values, i.e. primitives, arrays and nested simple objects.
 */
export declare function simpleDeepClone<T extends string | number | any[] | object>(input: T): T;
