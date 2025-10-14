import { DynamicModule } from '@nestjs/common';
/**
 * This function dynamically creates a Nest module to house any GraphQL resolvers defined by
 * any configured plugins.
 */
export declare function createDynamicGraphQlModulesForPlugins(apiType: 'shop' | 'admin'): DynamicModule[];
