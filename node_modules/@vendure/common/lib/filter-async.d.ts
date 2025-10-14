/**
 * Performs a filter operation where the predicate is an async function returning a Promise.
 */
export declare function filterAsync<T>(arr: T[], predicate: (item: T, index: number) => Promise<boolean> | boolean): Promise<T[]>;
