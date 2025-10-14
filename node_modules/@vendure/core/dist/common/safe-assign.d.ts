/**
 * Safely assigns a property to an object, preventing prototype pollution.
 *
 * This function guards against prototype pollution by:
 * 1. Blocking dangerous property names (__proto__, constructor, prototype)
 * 2. Using Object.defineProperty for safer assignment instead of direct assignment
 *
 * @param target - The target object to assign the property to
 * @param key - The property key to assign
 * @param value - The value to assign to the property
 */
export declare function safeAssign(target: any, key: string, value: any): void;
