import { DynamicModule } from '@nestjs/common';
import { ValidationContext } from 'graphql';
import { ConfigService } from '../../config/config.service';
export interface GraphQLApiOptions {
    apiType: 'shop' | 'admin';
    typePaths: string[];
    apiPath: string;
    debug: boolean;
    playground: boolean | any;
    resolverModule: Function;
    validationRules: Array<(context: ValidationContext) => any>;
}
/**
 * Dynamically generates a GraphQLModule according to the given config options.
 */
export declare function configureGraphQLModule(getOptions: (configService: ConfigService) => GraphQLApiOptions): DynamicModule;
