import { EntitySubscriberInterface, InsertEvent, UpdateEvent } from 'typeorm';
import { ConfigService } from '../config/config.service';
import { HasCustomFields } from '../config/custom-field/custom-field-types';
import { TransactionalConnection } from './transactional-connection';
export declare class CustomFieldsValidationSubscriber implements EntitySubscriberInterface {
    private connection;
    private configService;
    constructor(connection: TransactionalConnection, configService: ConfigService);
    validateCustomFields(entityName: string, entity: Partial<HasCustomFields>): void;
    private resolveCustomFieldsConfig;
    beforeInsert(event: InsertEvent<any>): void;
    beforeUpdate(event: UpdateEvent<any>): void;
}
