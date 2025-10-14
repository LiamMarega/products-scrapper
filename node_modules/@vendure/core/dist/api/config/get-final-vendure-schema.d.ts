import { GraphQLTypesLoader } from '@nestjs/graphql';
import { GraphQLSchema } from 'graphql/index';
import { EntityIdStrategy, RuntimeVendureConfig } from '../../config/index';
type GetSchemaOptions = {
    config: RuntimeVendureConfig;
    typePaths: string[];
    typesLoader: GraphQLTypesLoader;
    apiType: 'shop' | 'admin';
};
type GetSchemaAsSDLOptions = GetSchemaOptions & {
    output: 'sdl';
};
/**
 * @description
 * Build the full Vendure GraphQL schema, including any custom fields, API extensions,
 * custom scalars etc. defined in plugins.
 *
 * By setting the `output` option to `'sdl'`, the schema can be output as an SDL string.
 * This is safe to use in scenarios where there might be multiple versions of
 * the `graphql` package installed, where otherwise passing around the actual
 * `GraphQLSchema` object might lead to conflicts.
 *
 * @example
 * ```ts
 * import { getFinalVendureSchema, VENDURE_ADMIN_API_TYPE_PATHS } from '\@vendure/core';
 * import { GraphQLTypesLoader } from '@nestjs/graphql';
 *
 * import { config } from './vendure-config';
 *
 * const typesLoader = new GraphQLTypesLoader();
 *
 * const finalSchema = await getFinalVendureSchema({
 *     config,
 *     typePaths: VENDURE_ADMIN_API_TYPE_PATHS,
 *     typesLoader,
 *     apiType: 'admin',
 *     output: 'sdl',
 * });
 * ```
 *
 * @param options
 */
export declare function getFinalVendureSchema(options: GetSchemaOptions): Promise<GraphQLSchema>;
export declare function getFinalVendureSchema(options: GetSchemaAsSDLOptions): Promise<string>;
export declare function buildSchemaFromVendureConfig(schema: GraphQLSchema, config: RuntimeVendureConfig, apiType: 'shop' | 'admin'): GraphQLSchema;
export declare function isUsingDefaultEntityIdStrategy(entityIdStrategy: EntityIdStrategy<any>): boolean;
export {};
