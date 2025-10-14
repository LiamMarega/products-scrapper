"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FulfillmentStateMachine = void 0;
const common_1 = require("@nestjs/common");
const errors_1 = require("../../../common/error/errors");
const finite_state_machine_1 = require("../../../common/finite-state-machine/finite-state-machine");
const merge_transition_definitions_1 = require("../../../common/finite-state-machine/merge-transition-definitions");
const validate_transition_definition_1 = require("../../../common/finite-state-machine/validate-transition-definition");
const utils_1 = require("../../../common/utils");
const config_service_1 = require("../../../config/config.service");
const vendure_logger_1 = require("../../../config/logger/vendure-logger");
let FulfillmentStateMachine = class FulfillmentStateMachine {
    constructor(configService) {
        this.configService = configService;
        this.initialState = 'Created';
        this.config = this.initConfig();
    }
    getInitialState() {
        return this.initialState;
    }
    canTransition(currentState, newState) {
        return new finite_state_machine_1.FSM(this.config, currentState).canTransitionTo(newState);
    }
    getNextStates(fulfillment) {
        const fsm = new finite_state_machine_1.FSM(this.config, fulfillment.state);
        return fsm.getNextStates();
    }
    async transition(ctx, fulfillment, orders, state) {
        const fsm = new finite_state_machine_1.FSM(this.config, fulfillment.state);
        const result = await fsm.transitionTo(state, { ctx, orders, fulfillment });
        fulfillment.state = fsm.currentState;
        return result;
    }
    initConfig() {
        var _a, _b;
        // TODO: remove once the customFulfillmentProcess option is removed
        const customProcesses = (_a = this.configService.shippingOptions.customFulfillmentProcess) !== null && _a !== void 0 ? _a : [];
        const processes = [...customProcesses, ...((_b = this.configService.shippingOptions.process) !== null && _b !== void 0 ? _b : [])];
        const allTransitions = processes.reduce((transitions, process) => (0, merge_transition_definitions_1.mergeTransitionDefinitions)(transitions, process.transitions), {});
        const validationResult = (0, validate_transition_definition_1.validateTransitionDefinition)(allTransitions, this.initialState);
        if (!validationResult.valid && validationResult.error) {
            vendure_logger_1.Logger.error(`The fulfillment process has an invalid configuration:`);
            throw new Error(validationResult.error);
        }
        if (validationResult.valid && validationResult.error) {
            vendure_logger_1.Logger.warn(`Fulfillment process: ${validationResult.error}`);
        }
        return {
            transitions: allTransitions,
            onTransitionStart: async (fromState, toState, data) => {
                for (const process of processes) {
                    if (typeof process.onTransitionStart === 'function') {
                        const result = await (0, utils_1.awaitPromiseOrObservable)(process.onTransitionStart(fromState, toState, data));
                        if (result === false || typeof result === 'string') {
                            return result;
                        }
                    }
                }
            },
            onTransitionEnd: async (fromState, toState, data) => {
                for (const process of processes) {
                    if (typeof process.onTransitionEnd === 'function') {
                        await (0, utils_1.awaitPromiseOrObservable)(process.onTransitionEnd(fromState, toState, data));
                    }
                }
            },
            onError: async (fromState, toState, message) => {
                for (const process of processes) {
                    if (typeof process.onTransitionError === 'function') {
                        await (0, utils_1.awaitPromiseOrObservable)(process.onTransitionError(fromState, toState, message));
                    }
                }
                throw new errors_1.IllegalOperationError(message || 'error.cannot-transition-fulfillment-from-to', {
                    fromState,
                    toState,
                });
            },
        };
    }
};
exports.FulfillmentStateMachine = FulfillmentStateMachine;
exports.FulfillmentStateMachine = FulfillmentStateMachine = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], FulfillmentStateMachine);
//# sourceMappingURL=fulfillment-state-machine.js.map