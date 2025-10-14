import { DynamicModule } from '@nestjs/common';
/**
 * This module collects and re-exports all providers defined in plugins so that they can be used in other
 * modules.
 */
export declare class PluginModule {
    static forRoot(): DynamicModule;
}
