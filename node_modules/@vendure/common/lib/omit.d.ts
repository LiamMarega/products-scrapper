export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/**
 * Type-safe omit function - returns a new object which omits the specified keys.
 */
export declare function omit<T extends object, K extends keyof T>(obj: T, keysToOmit: K[]): Omit<T, K>;
export declare function omit<T extends object | any[], K extends keyof T>(obj: T, keysToOmit: string[], recursive: boolean): T;
