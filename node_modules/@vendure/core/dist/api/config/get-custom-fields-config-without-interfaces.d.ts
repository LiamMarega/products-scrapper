import { GraphQLSchema } from 'graphql';
import { CustomFieldConfig, CustomFields } from '../../config/custom-field/custom-field-types';
/**
 * @description
 * Because the "Region" entity is an interface, it cannot be extended directly, so we need to
 * replace it if found in the custom field config with its concrete implementations.
 *
 * Same goes for the "StockMovement" entity.
 */
export declare function getCustomFieldsConfigWithoutInterfaces(customFieldConfig: CustomFields, schema: GraphQLSchema): Array<[entityName: string, config: CustomFieldConfig[]]>;
