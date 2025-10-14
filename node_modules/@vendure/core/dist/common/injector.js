"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Injector = void 0;
/**
 * @description
 * The Injector wraps the underlying Nestjs `ModuleRef`, allowing injection of providers
 * known to the application's dependency injection container. This is intended to enable the injection
 * of services into objects which exist outside of the Nestjs module system, e.g. the various
 * Strategies which can be supplied in the VendureConfig.
 *
 * @docsCategory common
 */
class Injector {
    constructor(moduleRef) {
        this.moduleRef = moduleRef;
    }
    /**
     * @description
     * Retrieve an instance of the given type from the app's dependency injection container.
     * Wraps the Nestjs `ModuleRef.get()` method.
     */
    get(typeOrToken) {
        return this.moduleRef.get(typeOrToken, { strict: false });
    }
    /**
     * @description
     * Retrieve an instance of the given scoped provider (transient or request-scoped) from the
     * app's dependency injection container.
     * Wraps the Nestjs `ModuleRef.resolve()` method.
     */
    resolve(typeOrToken, contextId) {
        return this.moduleRef.resolve(typeOrToken, contextId, { strict: false });
    }
}
exports.Injector = Injector;
//# sourceMappingURL=injector.js.map