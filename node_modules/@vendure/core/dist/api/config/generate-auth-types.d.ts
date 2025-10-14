import { GraphQLSchema } from 'graphql';
import { AuthenticationStrategy } from '../../config/auth/authentication-strategy';
/**
 * This function is responsible for constructing the `AuthenticationInput` GraphQL input type.
 * It does so based on the inputs defined by the configured AuthenticationStrategy defineInputType
 * methods, dynamically building a mapped input type of the format:
 *
 *```
 * {
 *     [strategy_name]: strategy_input_type
 * }
 * ```
 */
export declare function generateAuthenticationTypes(schema: GraphQLSchema, authenticationStrategies: AuthenticationStrategy[]): GraphQLSchema;
