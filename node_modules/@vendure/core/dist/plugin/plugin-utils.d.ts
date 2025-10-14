import { RequestHandler } from 'express';
/**
 * @description
 * Creates a proxy middleware which proxies the given route to the given port.
 * Useful for plugins which start their own servers but should be accessible
 * via the main Vendure url.
 *
 * @example
 * ```ts
 * // Example usage in the `configuration` method of a VendurePlugin.
 * // Imagine that we have started a Node server on port 5678
 * // running some service which we want to access via the `/my-plugin/`
 * // route of the main Vendure server.
 * \@VendurePlugin({
 *   configuration: (config: Required<VendureConfig>) => {
 *       config.apiOptions.middleware.push({
 *           handler: createProxyHandler({
 *               label: 'Admin UI',
 *               route: 'my-plugin',
 *               port: 5678,
 *           }),
 *           route: 'my-plugin',
 *       });
 *       return config;
 *   }
 * })
 * export class MyPlugin {}
 * ```
 *
 * @docsCategory Plugin
 * @docsPage Plugin Utilities
 */
export declare function createProxyHandler(options: ProxyOptions): RequestHandler;
/**
 * @description
 * Options to configure proxy middleware via {@link createProxyHandler}.
 *
 * @docsCategory Plugin
 * @docsPage Plugin Utilities
 */
export interface ProxyOptions {
    /**
     * @description
     * A human-readable label for the service which is being proxied. Used to
     * generate more informative logs.
     */
    label: string;
    /**
     * @description
     * The route of the Vendure server which will act as the proxy url.
     */
    route: string;
    /**
     * @description
     * The port on which the service being proxied is running.
     */
    port: number;
    /**
     * @description
     * The hostname of the server on which the service being proxied is running.
     *
     * @default 'localhost'
     */
    hostname?: string;
    /**
     * @description
     * An optional base path on the proxied server.
     */
    basePath?: string;
}
/**
 * Use this function to add a line to the bootstrap log output listing a service added
 * by this plugin.
 */
export declare function registerPluginStartupMessage(serviceName: string, path: string): void;
export declare function getPluginStartupMessages(): ReadonlyArray<{
    label: string;
    path: string;
}>;
