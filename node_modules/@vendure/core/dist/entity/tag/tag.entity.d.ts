import { DeepPartial } from '@vendure/common/lib/shared-types';
import { VendureEntity } from '../base/base.entity';
/**
 * @description
 * A tag is an arbitrary label which can be applied to certain entities.
 * It is used to help organize and filter those entities.
 *
 * @docsCategory entities
 */
export declare class Tag extends VendureEntity {
    constructor(input?: DeepPartial<Tag>);
    value: string;
}
