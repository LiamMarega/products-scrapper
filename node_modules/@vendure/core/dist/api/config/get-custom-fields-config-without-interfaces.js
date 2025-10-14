"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomFieldsConfigWithoutInterfaces = getCustomFieldsConfigWithoutInterfaces;
const graphql_1 = require("graphql");
/**
 * @description
 * Because the "Region" entity is an interface, it cannot be extended directly, so we need to
 * replace it if found in the custom field config with its concrete implementations.
 *
 * Same goes for the "StockMovement" entity.
 */
function getCustomFieldsConfigWithoutInterfaces(customFieldConfig, schema) {
    var _a;
    const entries = Object.entries(customFieldConfig);
    const interfaceEntities = ['Region', 'StockMovement'];
    for (const entityName of interfaceEntities) {
        const index = entries.findIndex(([name]) => name === entityName);
        if (index !== -1) {
            // An interface type such as Region or StockMovement cannot directly be extended.
            // Instead, we will use the concrete types that implement it.
            const interfaceType = schema.getType(entityName);
            if ((0, graphql_1.isInterfaceType)(interfaceType)) {
                const implementations = schema.getImplementations(interfaceType);
                // Remove the interface from the list of entities to which custom fields can be added
                entries.splice(index, 1);
                for (const implementation of implementations.objects) {
                    entries.push([implementation.name, (_a = customFieldConfig[entityName]) !== null && _a !== void 0 ? _a : []]);
                }
            }
        }
    }
    return entries;
}
//# sourceMappingURL=get-custom-fields-config-without-interfaces.js.map