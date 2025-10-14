/**
 * @description
 * Resolver param decorator which extracts the {@link RequestContext} from the incoming
 * request object.
 *
 * @example
 * ```ts
 *  \@Query()
 *  getAdministrators(\@Ctx() ctx: RequestContext) {
 *      // ...
 *  }
 * ```
 *
 * @docsCategory request
 * @docsPage Ctx Decorator
 */
export declare const Ctx: (...dataOrPipes: any[]) => ParameterDecorator;
