"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreSubscribersMap = exports.CalculatedPropertySubscriber = void 0;
const typeorm_1 = require("typeorm");
const calculated_decorator_1 = require("../common/calculated-decorator");
/**
 * @docs Subscribes to events entities to handle calculated decorators
 *
 * @docsCategory data-access
 */
let CalculatedPropertySubscriber = class CalculatedPropertySubscriber {
    afterLoad(event) {
        this.moveCalculatedGettersToInstance(event);
    }
    afterInsert(event) {
        this.moveCalculatedGettersToInstance(event.entity);
    }
    /**
     * For any entity properties decorated with @Calculated(), this subscriber transfers
     * the getter from the entity prototype to the entity instance, so that it can be
     * correctly enumerated and serialized in the API response.
     */
    moveCalculatedGettersToInstance(entity) {
        if (entity) {
            const prototype = Object.getPrototypeOf(entity);
            if (prototype.hasOwnProperty(calculated_decorator_1.CALCULATED_PROPERTIES)) {
                for (const calculatedPropertyDef of prototype[calculated_decorator_1.CALCULATED_PROPERTIES]) {
                    const getterDescriptor = Object.getOwnPropertyDescriptor(prototype, calculatedPropertyDef.name);
                    // eslint-disable-next-line @typescript-eslint/unbound-method
                    const getFn = getterDescriptor && getterDescriptor.get;
                    if (getFn && !entity.hasOwnProperty(calculatedPropertyDef.name)) {
                        const boundGetFn = getFn.bind(entity);
                        Object.defineProperties(entity, {
                            [calculatedPropertyDef.name]: {
                                get: () => boundGetFn(),
                                enumerable: true,
                            },
                        });
                    }
                }
            }
        }
    }
};
exports.CalculatedPropertySubscriber = CalculatedPropertySubscriber;
exports.CalculatedPropertySubscriber = CalculatedPropertySubscriber = __decorate([
    (0, typeorm_1.EventSubscriber)()
], CalculatedPropertySubscriber);
/**
 * A map of the core TypeORM Subscribers.
 */
exports.coreSubscribersMap = {
    CalculatedPropertySubscriber,
};
//# sourceMappingURL=subscribers.js.map