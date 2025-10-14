import { Transitions } from './types';
/**
 * Merges two state machine Transitions definitions.
 */
export declare function mergeTransitionDefinitions<A extends string, B extends string>(a: Transitions<A>, b?: Transitions<B>): Transitions<A | B>;
