import { Request } from 'express';
import { Stream } from 'stream';
import { AssetStorageStrategy } from './asset-storage-strategy';
/**
 * A placeholder strategy which will simply throw an error when used.
 */
export declare class NoAssetStorageStrategy implements AssetStorageStrategy {
    writeFileFromStream(fileName: string, data: Stream): Promise<string>;
    writeFileFromBuffer(fileName: string, data: Buffer): Promise<string>;
    readFileToBuffer(identifier: string): Promise<Buffer>;
    readFileToStream(identifier: string): Promise<Stream>;
    deleteFile(identifier: string): Promise<void>;
    toAbsoluteUrl(request: Request, identifier: string): string;
    fileExists(fileName: string): Promise<boolean>;
}
