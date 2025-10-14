import { StateMachineConfig } from './types';
/**
 * @description
 * A simple type-safe finite state machine. This is used internally to control the Order process, ensuring that
 * the state of Orders, Payments, Fulfillments and Refunds follows a well-defined behaviour.
 *
 * @docsCategory StateMachine
 */
export declare class FSM<T extends string, Data = any> {
    private config;
    private readonly _initialState;
    private _currentState;
    constructor(config: StateMachineConfig<T, Data>, initialState: T);
    /**
     * Returns the state with which the FSM was initialized.
     */
    get initialState(): T;
    /**
     * Returns the current state.
     */
    get currentState(): T;
    /**
     * Attempts to transition from the current state to the given state. If this transition is not allowed
     * per the config, then an error will be logged.
     */
    transitionTo(state: T, data: Data): Promise<{
        finalize: () => Promise<any>;
    }>;
    /**
     * Jumps from the current state to the given state without regard to whether this transition is allowed or not.
     * None of the lifecycle callbacks will be invoked.
     */
    jumpTo(state: T): void;
    /**
     * Returns an array of state to which the machine may transition from the current state.
     */
    getNextStates(): readonly T[];
    /**
     * Returns true if the machine can transition from its current state to the given state.
     */
    canTransitionTo(state: T): boolean;
    private onError;
}
