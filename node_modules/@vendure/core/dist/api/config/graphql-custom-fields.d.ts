import { GraphQLSchema } from 'graphql';
import { CustomFieldConfig, CustomFields } from '../../config/custom-field/custom-field-types';
/**
 * Given a CustomFields config object, generates an SDL string extending the built-in
 * types with a customFields property for all entities, translations and inputs for which
 * custom fields are defined.
 */
export declare function addGraphQLCustomFields(typeDefsOrSchema: string | GraphQLSchema, customFieldConfig: CustomFields, publicOnly: boolean): GraphQLSchema;
export declare function addServerConfigCustomFields(typeDefsOrSchema: string | GraphQLSchema, customFieldConfig: CustomFields): GraphQLSchema;
export declare function addActiveAdministratorCustomFields(typeDefsOrSchema: string | GraphQLSchema, administratorCustomFields: CustomFieldConfig[]): GraphQLSchema;
/**
 * If CustomFields are defined on the Customer entity, then an extra `customFields` field is added to
 * the `RegisterCustomerInput` so that public writable custom fields can be set when a new customer
 * is registered.
 */
export declare function addRegisterCustomerCustomFieldsInput(typeDefsOrSchema: string | GraphQLSchema, customerCustomFields: CustomFieldConfig[]): GraphQLSchema;
/**
 * If CustomFields are defined on the Order entity, we add a `customFields` field to the ModifyOrderInput
 * type.
 */
export declare function addModifyOrderCustomFields(typeDefsOrSchema: string | GraphQLSchema, orderCustomFields: CustomFieldConfig[]): GraphQLSchema;
/**
 * If CustomFields are defined on the OrderLine entity, then an extra `customFields` argument
 * must be added to the `addItemToOrder` and `adjustOrderLine` mutations, as well as the related
 * fields in the `ModifyOrderInput` type.
 */
export declare function addOrderLineCustomFieldsInput(typeDefsOrSchema: string | GraphQLSchema, orderLineCustomFields: CustomFieldConfig[], publicOnly: boolean): GraphQLSchema;
export declare function addShippingMethodQuoteCustomFields(typeDefsOrSchema: string | GraphQLSchema, shippingMethodCustomFields: CustomFieldConfig[]): GraphQLSchema;
export declare function addPaymentMethodQuoteCustomFields(typeDefsOrSchema: string | GraphQLSchema, paymentMethodCustomFields: CustomFieldConfig[]): GraphQLSchema;
