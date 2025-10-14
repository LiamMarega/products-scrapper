import { DeepPartial } from '@vendure/common/lib/shared-types';
import { VendureEntity } from '../../entity/base/base.entity';
export declare class CacheItem extends VendureEntity {
    constructor(input: DeepPartial<CacheItem>);
    insertedAt: Date;
    key: string;
    value: string;
    expiresAt?: Date;
}
