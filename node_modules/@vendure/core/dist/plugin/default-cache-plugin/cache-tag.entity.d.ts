import { DeepPartial } from '@vendure/common/lib/shared-types';
import { VendureEntity } from '../../entity/base/base.entity';
import { CacheItem } from './cache-item.entity';
export declare class CacheTag extends VendureEntity {
    constructor(input: DeepPartial<CacheTag>);
    tag: string;
    item: CacheItem;
    itemId: string;
}
