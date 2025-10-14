import { Channel } from '../../../entity/channel/channel.entity';
import { Role } from '../../../entity/role/role.entity';
import { RoleService } from '../../../service/services/role.service';
import { RequestContext } from '../../common/request-context';
export declare class RoleEntityResolver {
    private roleService;
    constructor(roleService: RoleService);
    channels(ctx: RequestContext, role: Role): Promise<Channel[]>;
}
