import { ConfigService } from '../../config/config.service';
export declare class IdCodecService {
    private idCodec;
    constructor(configService: ConfigService);
    encode<T extends string | number | boolean | object | undefined>(target: T, transformKeys?: string[]): T;
    decode<T extends string | number | object | undefined>(target: T, transformKeys?: string[]): T;
}
