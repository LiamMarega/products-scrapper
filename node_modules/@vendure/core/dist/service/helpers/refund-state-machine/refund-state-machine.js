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
exports.RefundStateMachine = void 0;
const common_1 = require("@nestjs/common");
const errors_1 = require("../../../common/error/errors");
const finite_state_machine_1 = require("../../../common/finite-state-machine/finite-state-machine");
const merge_transition_definitions_1 = require("../../../common/finite-state-machine/merge-transition-definitions");
const validate_transition_definition_1 = require("../../../common/finite-state-machine/validate-transition-definition");
const utils_1 = require("../../../common/utils");
const config_service_1 = require("../../../config/config.service");
const vendure_logger_1 = require("../../../config/logger/vendure-logger");
let RefundStateMachine = class RefundStateMachine {
    constructor(configService) {
        this.configService = configService;
        this.initialState = 'Pending';
        this.config = this.initConfig();
    }
    getInitialState() {
        return this.initialState;
    }
    getNextStates(refund) {
        const fsm = new finite_state_machine_1.FSM(this.config, refund.state);
        return fsm.getNextStates();
    }
    async transition(ctx, order, refund, state) {
        const fsm = new finite_state_machine_1.FSM(this.config, refund.state);
        const result = await fsm.transitionTo(state, { ctx, order, refund });
        refund.state = state;
        return result;
    }
    initConfig() {
        var _a;
        const processes = [...((_a = this.configService.paymentOptions.refundProcess) !== null && _a !== void 0 ? _a : [])];
        const allTransitions = processes.reduce((transitions, process) => (0, merge_transition_definitions_1.mergeTransitionDefinitions)(transitions, process.transitions), {});
        const validationResult = (0, validate_transition_definition_1.validateTransitionDefinition)(allTransitions, this.initialState);
        if (!validationResult.valid && validationResult.error) {
            vendure_logger_1.Logger.error(`The refund process has an invalid configuration:`);
            throw new Error(validationResult.error);
        }
        if (validationResult.valid && validationResult.error) {
            vendure_logger_1.Logger.warn(`Refund process: ${validationResult.error}`);
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
                throw new errors_1.IllegalOperationError(message || 'error.cannot-transition-refund-from-to', {
                    fromState,
                    toState,
                });
            },
        };
    }
};
exports.RefundStateMachine = RefundStateMachine;
exports.RefundStateMachine = RefundStateMachine = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], RefundStateMachine);
//# sourceMappingURL=refund-state-machine.js.map