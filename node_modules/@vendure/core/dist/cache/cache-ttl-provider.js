"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestingCacheTtlProvider = exports.DefaultCacheTtlProvider = void 0;
/**
 * @description
 * The default implementation of the {@link CacheTtlProvider} which
 * simply returns the current time.
 */
class DefaultCacheTtlProvider {
    /**
     * @description
     * Returns the current timestamp in milliseconds.
     */
    getTime() {
        return new Date().getTime();
    }
}
exports.DefaultCacheTtlProvider = DefaultCacheTtlProvider;
/**
 * @description
 * A testing implementation of the {@link CacheTtlProvider} which
 * allows the time to be set manually.
 */
class TestingCacheTtlProvider {
    constructor() {
        this.time = 0;
    }
    setTime(timestampInMs) {
        this.time = timestampInMs;
    }
    incrementTime(ms) {
        this.time += ms;
    }
    getTime() {
        return this.time;
    }
}
exports.TestingCacheTtlProvider = TestingCacheTtlProvider;
//# sourceMappingURL=cache-ttl-provider.js.map