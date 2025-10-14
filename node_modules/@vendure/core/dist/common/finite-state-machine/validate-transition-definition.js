"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransitionDefinition = validateTransitionDefinition;
/**
 * This function validates a finite state machine transition graph to ensure
 * that all states are reachable from the given initial state.
 */
function validateTransitionDefinition(transitions, initialState) {
    if (!transitions[initialState]) {
        return {
            valid: false,
            error: `The initial state "${initialState}" is not defined`,
        };
    }
    const states = Object.keys(transitions);
    const result = states.reduce((res, state) => {
        return Object.assign(Object.assign({}, res), { [state]: { reachable: false } });
    }, {});
    // walk the state graph starting with the initialState and
    // check whether all states are reachable.
    function allStatesReached() {
        return Object.values(result).every(r => r.reachable);
    }
    function walkGraph(state) {
        const candidates = transitions[state].to;
        result[state].reachable = true;
        if (allStatesReached()) {
            return true;
        }
        for (const candidate of candidates) {
            if (result[candidate] === undefined) {
                throw new Error(`The state "${state}" has a transition to an unknown state "${candidate}"`);
            }
            if (!result[candidate].reachable) {
                walkGraph(candidate);
            }
        }
    }
    try {
        walkGraph(initialState);
    }
    catch (e) {
        return {
            valid: false,
            error: e.message,
        };
    }
    const error = !allStatesReached()
        ? `The following states are unreachable: ${Object.entries(result)
            .filter(([s, v]) => !v.reachable)
            .map(([s]) => s)
            .join(', ')}`
        : undefined;
    return {
        valid: true,
        error,
    };
}
//# sourceMappingURL=validate-transition-definition.js.map