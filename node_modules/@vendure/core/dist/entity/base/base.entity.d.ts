import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
/**
 * @description
 * This is the base class from which all entities inherit. The type of
 * the `id` property is defined by the {@link EntityIdStrategy}.
 *
 * @docsCategory entities
 */
export declare abstract class VendureEntity {
    protected constructor(input?: DeepPartial<VendureEntity>);
    id: ID;
    createdAt: Date;
    updatedAt: Date;
}
