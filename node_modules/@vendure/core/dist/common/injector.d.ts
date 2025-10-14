import { Type } from '@nestjs/common';
import { ContextId, ModuleRef } from '@nestjs/core';
/**
 * @description
 * The Injector wraps the underlying Nestjs `ModuleRef`, allowing injection of providers
 * known to the application's dependency injection container. This is intended to enable the injection
 * of services into objects which exist outside of the Nestjs module system, e.g. the various
 * Strategies which can be supplied in the VendureConfig.
 *
 * @docsCategory common
 */
export declare class Injector {
    private moduleRef;
    constructor(moduleRef: ModuleRef);
    /**
     * @description
     * Retrieve an instance of the given type from the app's dependency injection container.
     * Wraps the Nestjs `ModuleRef.get()` method.
     */
    get<T, R = T>(typeOrToken: Type<T> | string | symbol): R;
    /**
     * @description
     * Retrieve an instance of the given scoped provider (transient or request-scoped) from the
     * app's dependency injection container.
     * Wraps the Nestjs `ModuleRef.resolve()` method.
     */
    resolve<T, R = T>(typeOrToken: Type<T> | string | symbol, contextId?: ContextId): Promise<R>;
}
