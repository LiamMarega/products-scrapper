"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoopSessionCacheStrategy = void 0;
/**
 * @description
 * A cache that doesn't cache. The cache lookup will miss every time
 * so the session will always be taken from the database.
 *
 * @docsCategory auth
 */
class NoopSessionCacheStrategy {
    clear() {
        return undefined;
    }
    delete(sessionToken) {
        return undefined;
    }
    get(sessionToken) {
        return undefined;
    }
    set(session) {
        return undefined;
    }
}
exports.NoopSessionCacheStrategy = NoopSessionCacheStrategy;
//# sourceMappingURL=noop-session-cache-strategy.js.map