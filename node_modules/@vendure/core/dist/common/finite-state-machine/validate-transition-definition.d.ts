import { Transitions } from './types';
/**
 * This function validates a finite state machine transition graph to ensure
 * that all states are reachable from the given initial state.
 */
export declare function validateTransitionDefinition<T extends string>(transitions: Transitions<T>, initialState: T): {
    valid: boolean;
    error?: string;
};
