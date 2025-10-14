/**
 * @description
 * This interface is used to provide the current time in milliseconds.
 * The reason it is abstracted in this way is so that the cache
 * implementations can be more easily tested.
 *
 * In an actual application you would not need to change the default.
 */
export interface CacheTtlProvider {
    /**
     * @description
     * Returns the current timestamp in milliseconds.
     */
    getTime(): number;
}
/**
 * @description
 * The default implementation of the {@link CacheTtlProvider} which
 * simply returns the current time.
 */
export declare class DefaultCacheTtlProvider implements CacheTtlProvider {
    /**
     * @description
     * Returns the current timestamp in milliseconds.
     */
    getTime(): number;
}
/**
 * @description
 * A testing implementation of the {@link CacheTtlProvider} which
 * allows the time to be set manually.
 */
export declare class TestingCacheTtlProvider implements CacheTtlProvider {
    private time;
    setTime(timestampInMs: number): void;
    incrementTime(ms: number): void;
    getTime(): number;
}
