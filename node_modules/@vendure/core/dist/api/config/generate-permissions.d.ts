import { GraphQLSchema } from 'graphql';
import { PermissionDefinition } from '../../common/permission-definition';
/**
 * Generates the `Permission` GraphQL enum based on the default & custom permission definitions.
 */
export declare function generatePermissionEnum(schema: GraphQLSchema, customPermissions: PermissionDefinition[]): GraphQLSchema;
