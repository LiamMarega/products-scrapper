"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CALCULATED_PROPERTIES = void 0;
exports.Calculated = Calculated;
/**
 * The property name we use to store the CalculatedColumnDefinitions to the
 * entity class.
 */
exports.CALCULATED_PROPERTIES = '__calculatedProperties__';
/**
 * @description
 * Used to define calculated entity getters. The decorator simply attaches an array of "calculated"
 * property names to the entity's prototype. This array is then used by the {@link CalculatedPropertySubscriber}
 * to transfer the getter function from the prototype to the entity instance.
 *
 * @docsCategory data-access
 * @docsWeight 0
 */
function Calculated(queryInstruction) {
    return (target, propertyKey, descriptor) => {
        const definition = {
            name: propertyKey,
            listQuery: queryInstruction,
        };
        if (target[exports.CALCULATED_PROPERTIES]) {
            if (!target[exports.CALCULATED_PROPERTIES].map((p) => p.name).includes(definition.name)) {
                target[exports.CALCULATED_PROPERTIES].push(definition);
            }
        }
        else {
            target[exports.CALCULATED_PROPERTIES] = [definition];
        }
    };
}
//# sourceMappingURL=calculated-decorator.js.map