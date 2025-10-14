import { DuplicateEntityInput, DuplicateEntityResult, EntityDuplicatorDefinition } from '@vendure/common/lib/generated-types';
import { RequestContext } from '../../../api/common/request-context';
import { ConfigService } from '../../../config/config.service';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { ConfigArgService } from '../config-arg/config-arg.service';
/**
 * @description
 * This service is used to duplicate entities using one of the configured
 * {@link EntityDuplicator} functions.
 *
 * @docsCategory service-helpers
 * @since 2.2.0
 */
export declare class EntityDuplicatorService {
    private configService;
    private configArgService;
    private connection;
    constructor(configService: ConfigService, configArgService: ConfigArgService, connection: TransactionalConnection);
    /**
     * @description
     * Returns all configured {@link EntityDuplicator} definitions.
     */
    getEntityDuplicators(ctx: RequestContext): EntityDuplicatorDefinition[];
    /**
     * @description
     * Duplicates an entity using the specified {@link EntityDuplicator}. The duplication is performed
     * within a transaction, so if an error occurs, the transaction will be rolled back.
     */
    duplicateEntity(ctx: RequestContext, input: DuplicateEntityInput): Promise<DuplicateEntityResult>;
}
