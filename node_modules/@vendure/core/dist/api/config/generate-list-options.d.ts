import { GraphQLSchema } from 'graphql/index.js';
/**
 * Generates ListOptions inputs for queries which return PaginatedList types.
 */
export declare function generateListOptions(typeDefsOrSchema: string | GraphQLSchema): GraphQLSchema;
