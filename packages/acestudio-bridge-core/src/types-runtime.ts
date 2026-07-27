/**
 * Runtime types the generated bindings import.
 *
 * @remarks
 * acerpcgen emits `import type { Unsubscribe } from '../types-runtime'`, so this
 * module's path and name are part of the generator's contract, not a free
 * choice. Keep it to the types generated code needs.
 */

/** Cancels a registration, and is safe to call more than once. */
export type Unsubscribe = () => void;
