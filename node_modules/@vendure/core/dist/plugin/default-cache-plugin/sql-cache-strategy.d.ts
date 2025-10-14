import { JsonCompatible } from '@vendure/common/lib/shared-types';
import { CacheTtlProvider } from '../../cache/cache-ttl-provider';
import { Injector } from '../../common/injector';
import { ConfigService } from '../../config/index';
import { CacheStrategy, SetCacheKeyOptions } from '../../config/system/cache-strategy';
import { TransactionalConnection } from '../../connection/index';
/**
 * @description
 * A {@link CacheStrategy} that stores cached items in the database. This
 * is the strategy used by the {@link DefaultCachePlugin}.
 *
 * @since 3.1.0
 * @docsCategory cache
 */
export declare class SqlCacheStrategy implements CacheStrategy {
    protected cacheSize: number;
    protected ttlProvider: CacheTtlProvider;
    constructor(config?: {
        cacheSize?: number;
        cacheTtlProvider?: CacheTtlProvider;
    });
    protected connection: TransactionalConnection;
    protected configService: ConfigService;
    init(injector: Injector): void;
    get<T extends JsonCompatible<T>>(key: string): Promise<T | undefined>;
    set<T extends JsonCompatible<T>>(key: string, value: T, options?: SetCacheKeyOptions): Promise<void>;
    delete(key: string): Promise<void>;
    invalidateTags(tags: string[]): Promise<void>;
}
