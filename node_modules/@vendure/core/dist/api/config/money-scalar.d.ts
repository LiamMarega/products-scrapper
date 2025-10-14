import { GraphQLScalarType } from 'graphql';
export declare function isObjectLike(value: unknown): value is {
    [key: string]: unknown;
};
/**
 * @description
 * The Money scalar is used to represent monetary values in the GraphQL API. It is based on the native `Float` scalar.
 */
export declare const GraphQLMoney: GraphQLScalarType<number, number>;
