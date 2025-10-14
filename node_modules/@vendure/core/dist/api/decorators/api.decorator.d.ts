/**
 * @description
 * Resolver param decorator which returns which Api the request came though.
 * This is useful because sometimes the same resolver will have different behaviour
 * depending whether it is being called from the shop API or the admin API.
 *
 * Returns a string of type {@link ApiType}.
 *
 * @example
 * ```ts
 *  \@Query()
 *  getAdministrators(\@Api() apiType: ApiType) {
 *    if (apiType === 'admin') {
 *      // ...
 *    }
 *  }
 * ```
 * @docsCategory request
 * @docsPage Api Decorator
 */
export declare const Api: (...dataOrPipes: any[]) => ParameterDecorator;
