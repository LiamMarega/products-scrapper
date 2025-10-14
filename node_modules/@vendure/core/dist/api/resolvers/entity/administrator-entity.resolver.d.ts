import { TransactionalConnection } from '../../../connection/transactional-connection';
import { Administrator } from '../../../entity/administrator/administrator.entity';
import { User } from '../../../entity/user/user.entity';
import { RequestContext } from '../../common/request-context';
export declare class AdministratorEntityResolver {
    private connection;
    constructor(connection: TransactionalConnection);
    user(ctx: RequestContext, administrator: Administrator): Promise<User>;
}
