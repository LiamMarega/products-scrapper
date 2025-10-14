import { CachedSession, SessionCacheStrategy } from './session-cache-strategy';
/**
 * @description
 * A cache that doesn't cache. The cache lookup will miss every time
 * so the session will always be taken from the database.
 *
 * @docsCategory auth
 */
export declare class NoopSessionCacheStrategy implements SessionCacheStrategy {
    clear(): undefined;
    delete(sessionToken: string): undefined;
    get(sessionToken: string): undefined;
    set(session: CachedSession): undefined;
}
