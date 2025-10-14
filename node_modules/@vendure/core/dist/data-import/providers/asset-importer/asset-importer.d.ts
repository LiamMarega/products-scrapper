import { RequestContext } from '../../../api/common/request-context';
import { ConfigService } from '../../../config/config.service';
import { Asset } from '../../../entity/asset/asset.entity';
import { AssetService } from '../../../service/services/asset.service';
/**
 * @description
 * This service creates new {@link Asset} entities based on string paths provided in the CSV
 * import format. The source files are resolved by joining the value of `importExportOptions.importAssetsDir`
 * with the asset path. This service is used internally by the {@link Importer} service.
 *
 * @docsCategory import-export
 */
export declare class AssetImporter {
    private configService;
    private assetService;
    private assetMap;
    /** @internal */
    constructor(configService: ConfigService, assetService: AssetService);
    /**
     * @description
     * Creates Asset entities for the given paths, using the assetMap cache to prevent the
     * creation of duplicates.
     */
    getAssets(assetPaths: string[], ctx?: RequestContext): Promise<{
        assets: Asset[];
        errors: string[];
    }>;
}
