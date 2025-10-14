import { ConfigurableOperation, ConfigurableOperationInput } from '@vendure/common/lib/generated-types';
import { Type } from '@vendure/common/lib/shared-types';
import { ConfigurableOperationDef } from '../../common/configurable-operation';
import { ConfigService } from '../../config/config.service';
import { IdCodecService } from './id-codec.service';
export declare class ConfigurableOperationCodec {
    private configService;
    private idCodecService;
    constructor(configService: ConfigService, idCodecService: IdCodecService);
    /**
     * Decodes any ID type arguments of a ConfigurableOperationDef
     */
    decodeConfigurableOperationIds<T extends ConfigurableOperationDef<any>>(defType: Type<ConfigurableOperationDef<any>>, input: ConfigurableOperationInput[]): ConfigurableOperationInput[];
    /**
     * Encodes any ID type arguments of a ConfigurableOperationDef
     */
    encodeConfigurableOperationIds<T extends ConfigurableOperationDef<any>>(defType: Type<ConfigurableOperationDef<any>>, input: ConfigurableOperation[]): ConfigurableOperation[];
    getAvailableDefsOfType(defType: Type<ConfigurableOperationDef>): ConfigurableOperationDef[];
}
