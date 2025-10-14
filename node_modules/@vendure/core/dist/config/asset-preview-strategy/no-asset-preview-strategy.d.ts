import { RequestContext } from '../../api/common/request-context';
import { AssetPreviewStrategy } from './asset-preview-strategy';
/**
 * A placeholder strategy which will simply throw an error when used.
 */
export declare class NoAssetPreviewStrategy implements AssetPreviewStrategy {
    generatePreviewImage(ctx: RequestContext, mimeType: string, data: Buffer): Promise<Buffer>;
}
