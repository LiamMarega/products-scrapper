import { ID, Type } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../../api/common/request-context';
import { Translatable, TranslatedInput, Translation } from '../../../common/types/locale-types';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { VendureEntity } from '../../../entity/base/base.entity';
export interface CreateTranslatableOptions<T extends Translatable> {
    ctx: RequestContext;
    entityType: Type<T>;
    translationType: Type<Translation<T>>;
    input: TranslatedInput<T>;
    beforeSave?: (newEntity: T) => any | Promise<any>;
    typeOrmSubscriberData?: any;
}
export interface UpdateTranslatableOptions<T extends Translatable> extends CreateTranslatableOptions<T> {
    input: TranslatedInput<T> & {
        id: ID;
    };
}
/**
 * @description
 * A helper which contains methods for creating and updating entities which implement the {@link Translatable} interface.
 *
 * @example
 * ```ts
 * export class MyService {
 *   constructor(private translatableSaver: TranslatableSaver) {}
 *
 *   async create(ctx: RequestContext, input: CreateFacetInput): Promise<Translated<Facet>> {
 *     const facet = await this.translatableSaver.create({
 *       ctx,
 *       input,
 *       entityType: Facet,
 *       translationType: FacetTranslation,
 *       beforeSave: async f => {
 *           f.code = await this.ensureUniqueCode(ctx, f.code);
 *       },
 *     });
 *     return facet;
 *   }
 *
 *   // ...
 * }
 * ```
 *
 * @docsCategory service-helpers
 */
export declare class TranslatableSaver {
    private connection;
    constructor(connection: TransactionalConnection);
    /**
     * @description
     * Create a translatable entity, including creating any translation entities according
     * to the `translations` array.
     */
    create<T extends Translatable & VendureEntity>(options: CreateTranslatableOptions<T>): Promise<T>;
    /**
     * @description
     * Update a translatable entity. Performs a diff of the `translations` array in order to
     * perform the correct operation on the translations.
     */
    update<T extends Translatable & VendureEntity>(options: UpdateTranslatableOptions<T>): Promise<T>;
}
