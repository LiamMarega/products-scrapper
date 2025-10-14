import { GraphQLResolveInfo } from 'graphql';
/**
 * Returns true is this guard is being called on a FieldResolver, i.e. not a top-level
 * Query or Mutation resolver.
 */
export declare function isFieldResolver(info?: GraphQLResolveInfo): boolean;
