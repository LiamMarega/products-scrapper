import { DynamicModule } from '@nestjs/common';
import { Type } from '@vendure/common/lib/shared-types';
import { APIExtensionDefinition, DashboardExtension, PluginConfigurationFn } from './vendure-plugin';
export declare const PLUGIN_METADATA: {
    CONFIGURATION: string;
    SHOP_API_EXTENSIONS: string;
    ADMIN_API_EXTENSIONS: string;
    ENTITIES: string;
    COMPATIBILITY: string;
    DASHBOARD: string;
};
export declare function getEntitiesFromPlugins(plugins?: Array<Type<any> | DynamicModule>): Array<Type<any>>;
export declare function getModuleMetadata(module: Type<any>): {
    controllers: any;
    providers: any;
    imports: any;
    exports: any;
};
export declare function getPluginAPIExtensions(plugins: Array<Type<any> | DynamicModule>, apiType: 'shop' | 'admin'): APIExtensionDefinition[];
export declare function getPluginDashboardExtensions(plugins: Array<Type<any> | DynamicModule>): DashboardExtension[];
export declare function getCompatibility(plugin: Type<any> | DynamicModule): string | undefined;
export declare function getConfigurationFunction(plugin: Type<any> | DynamicModule): PluginConfigurationFn | undefined;
export declare function graphQLResolversFor(plugin: Type<any> | DynamicModule, apiType: 'shop' | 'admin'): Array<Type<any>>;
export declare function isDynamicModule(input: Type<any> | DynamicModule): input is DynamicModule;
