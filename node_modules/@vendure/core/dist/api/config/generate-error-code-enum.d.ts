import { GraphQLSchema } from 'graphql';
export declare const ERROR_INTERFACE_NAME = "ErrorResult";
/**
 * Generates the members of the `ErrorCode` enum dynamically, by getting the names of
 * all the types which inherit from the `ErrorResult` interface.
 */
export declare function generateErrorCodeEnum(typeDefsOrSchema: string | GraphQLSchema): GraphQLSchema;
