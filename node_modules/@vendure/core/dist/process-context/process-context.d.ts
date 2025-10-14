type ProcessContextType = 'server' | 'worker';
/**
 * @description
 * The ProcessContext can be injected into your providers & modules in order to know whether it
 * is being executed in the context of the main Vendure server or the worker.
 *
 * @example
 * ```ts
 * import { Injectable, OnApplicationBootstrap } from '\@nestjs/common';
 * import { ProcessContext } from '\@vendure/core';
 *
 * \@Injectable()
 * export class MyService implements OnApplicationBootstrap {
 *   constructor(private processContext: ProcessContext) {}
 *
 *   onApplicationBootstrap() {
 *     if (this.processContext.isServer) {
 *       // code which will only execute when running in
 *       // the server process
 *     }
 *   }
 * }
 * ```
 *
 * @docsCategory common
 */
export declare class ProcessContext {
    get isServer(): boolean;
    get isWorker(): boolean;
}
/**
 * @description
 * Should only be called in the core bootstrap functions in order to establish
 * the current process context.
 *
 * @internal
 */
export declare function setProcessContext(context: ProcessContextType): void;
export {};
