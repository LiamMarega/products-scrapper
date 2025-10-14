"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessContext = void 0;
exports.setProcessContext = setProcessContext;
let currentContext = 'server';
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
class ProcessContext {
    get isServer() {
        return currentContext === 'server';
    }
    get isWorker() {
        return currentContext === 'worker';
    }
}
exports.ProcessContext = ProcessContext;
/**
 * @description
 * Should only be called in the core bootstrap functions in order to establish
 * the current process context.
 *
 * @internal
 */
function setProcessContext(context) {
    currentContext = context;
}
//# sourceMappingURL=process-context.js.map