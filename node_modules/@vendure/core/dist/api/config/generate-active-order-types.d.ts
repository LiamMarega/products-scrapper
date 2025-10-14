import { GraphQLSchema } from 'graphql';
import { ActiveOrderStrategy } from '../../config/order/active-order-strategy';
/**
 * This function is responsible for constructing the `ActiveOrderInput` GraphQL input type.
 * It does so based on the inputs defined by the configured ActiveOrderStrategy defineInputType
 * methods, dynamically building a mapped input type of the format:
 *
 *```
 * {
 *     [strategy_name]: strategy_input_type
 * }
 * ```
 */
export declare function generateActiveOrderTypes(schema: GraphQLSchema, activeOrderStrategies: ActiveOrderStrategy | ActiveOrderStrategy[]): GraphQLSchema;
