import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Region, RegionType } from './region.entity';
/**
 * @description
 * A Province represents an administrative subdivision of a {@link Country}. For example, in the
 * United States, the country would be "United States" and the province would be "California".
 *
 * @docsCategory entities
 */
export declare class Province extends Region {
    constructor(input?: DeepPartial<Province>);
    readonly type: RegionType;
}
