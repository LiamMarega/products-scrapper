import { Permission } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { ChannelAware } from '../../common/types/common-types';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
/**
 * @description
 * A Role represents a collection of permissions which determine the authorization
 * level of a {@link User} on a given set of {@link Channel}s.
 *
 * @docsCategory entities
 */
export declare class Role extends VendureEntity implements ChannelAware {
    constructor(input?: DeepPartial<Role>);
    code: string;
    description: string;
    permissions: Permission[];
    channels: Channel[];
}
