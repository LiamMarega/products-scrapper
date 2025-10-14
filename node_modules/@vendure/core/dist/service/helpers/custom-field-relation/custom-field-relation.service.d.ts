import { Type } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../../api/common/request-context';
import { ConfigService } from '../../../config/config.service';
import { HasCustomFields } from '../../../config/custom-field/custom-field-types';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { VendureEntity } from '../../../entity/base/base.entity';
export declare class CustomFieldRelationService {
    private connection;
    private configService;
    constructor(connection: TransactionalConnection, configService: ConfigService);
    /**
     * @description
     * If the entity being created or updated has any custom fields of type `relation`, this
     * method will get the values from the input object and persist those relations in the
     * database.
     */
    updateRelations<T extends HasCustomFields & VendureEntity>(ctx: RequestContext, entityType: Type<T>, input: {
        customFields?: {
            [key: string]: any;
        };
    }, entity: T): Promise<T>;
    private isRelationalType;
    private isId;
}
