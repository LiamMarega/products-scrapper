import { MutationImportProductsArgs } from '@vendure/common/lib/generated-types';
import { Importer } from '../../../data-import/providers/importer/importer';
import { RequestContext } from '../../common/request-context';
export declare class ImportResolver {
    private importer;
    constructor(importer: Importer);
    importProducts(ctx: RequestContext, args: MutationImportProductsArgs): Promise<import("../../../data-import/providers/importer/importer").ImportProgress | undefined>;
}
