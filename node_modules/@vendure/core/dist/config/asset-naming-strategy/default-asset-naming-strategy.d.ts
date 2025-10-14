import { RequestContext } from '../../api/common/request-context';
import { AssetNamingStrategy } from './asset-naming-strategy';
/**
 * @description
 * The default strategy normalizes the file names to remove unwanted characters and
 * in the case of conflicts, increments a counter suffix.
 *
 * @docsCategory assets
 */
export declare class DefaultAssetNamingStrategy implements AssetNamingStrategy {
    private readonly numberingRe;
    generateSourceFileName(ctx: RequestContext, originalFileName: string, conflictFileName?: string): string;
    generatePreviewFileName(ctx: RequestContext, sourceFileName: string, conflictFileName?: string): string;
    /**
     * A "supported format" means that the Sharp library can transform it and output the same
     * file type. Unsupported images and other non-image files will be converted to png.
     *
     * See http://sharp.pixelplumbing.com/en/stable/api-output/#tobuffer
     */
    private isSupportedImageFormat;
    private incrementOrdinalSuffix;
    private addOrdinalSuffix;
    private addSuffix;
}
