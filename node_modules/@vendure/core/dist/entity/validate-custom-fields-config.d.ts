import { Type } from '@vendure/common/lib/shared-types';
import { CustomFields } from '../config/custom-field/custom-field-types';
/**
 * Validates the custom fields config, e.g. by ensuring that there are no naming conflicts with the built-in fields
 * of each entity.
 */
export declare function validateCustomFieldsConfig(customFieldConfig: CustomFields, entities: Array<Type<any>>): {
    valid: boolean;
    errors: string[];
};
