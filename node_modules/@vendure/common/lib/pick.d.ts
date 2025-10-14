/**
 * Returns a new object which is a subset of the input, including only the specified properties.
 * Can be called with a single argument (array of props to pick), in which case it returns a partially
 * applied pick function.
 */
export declare function pick<T extends string>(props: T[]): <U>(input: U) => Pick<U, Extract<keyof U, T>>;
export declare function pick<U, T extends keyof U>(input: U, props: T[]): {
    [K in T]: U[K];
};
