import { LanguageCode } from '@vendure/common/lib/generated-types';
import { ID, Type } from '@vendure/common/lib/shared-types';
import { RequestContext } from '../../../api/common/request-context';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { VendureEntity } from '../../../entity/base/base.entity';
/**
 * @docsCategory service-helpers
 * @docsPage SlugValidator
 */
export type InputWithSlug = {
    id?: ID | null;
    translations?: Array<{
        id?: ID | null;
        languageCode: LanguageCode;
        slug?: string | null;
    }> | null;
};
/**
 * @docsCategory service-helpers
 * @docsPage SlugValidator
 */
export type TranslationEntity = VendureEntity & {
    id: ID;
    languageCode: LanguageCode;
    slug: string;
    base: any;
};
/**
 * @description
 * Used to validate slugs to ensure they are URL-safe and unique. Designed to be used with translatable
 * entities such as {@link Product} and {@link Collection}.
 *
 * @docsCategory service-helpers
 * @docsWeight 0
 */
export declare class SlugValidator {
    private connection;
    constructor(connection: TransactionalConnection);
    /**
     * Normalizes the slug to be URL-safe, and ensures it is unique for the given languageCode.
     * Mutates the input.
     */
    validateSlugs<T extends InputWithSlug, E extends TranslationEntity>(ctx: RequestContext, input: T, translationEntity: Type<E>): Promise<T>;
}
