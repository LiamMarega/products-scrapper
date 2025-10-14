import { DeletionResponse, MutationCreateTaxCategoryArgs, MutationDeleteTaxCategoryArgs, MutationUpdateTaxCategoryArgs, MutationDeleteTaxCategoriesArgs, QueryTaxCategoriesArgs, QueryTaxCategoryArgs } from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';
import { TaxCategory } from '../../../entity/tax-category/tax-category.entity';
import { TaxCategoryService } from '../../../service/services/tax-category.service';
import { RequestContext } from '../../common/request-context';
export declare class TaxCategoryResolver {
    private taxCategoryService;
    constructor(taxCategoryService: TaxCategoryService);
    taxCategories(ctx: RequestContext, args: QueryTaxCategoriesArgs): Promise<PaginatedList<TaxCategory>>;
    taxCategory(ctx: RequestContext, args: QueryTaxCategoryArgs): Promise<TaxCategory | undefined>;
    createTaxCategory(ctx: RequestContext, args: MutationCreateTaxCategoryArgs): Promise<TaxCategory>;
    updateTaxCategory(ctx: RequestContext, args: MutationUpdateTaxCategoryArgs): Promise<TaxCategory>;
    deleteTaxCategory(ctx: RequestContext, args: MutationDeleteTaxCategoryArgs): Promise<DeletionResponse>;
    deleteTaxCategories(ctx: RequestContext, args: MutationDeleteTaxCategoriesArgs): Promise<DeletionResponse[]>;
}
