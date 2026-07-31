/**
 * Runtime types the generated wire surface under `generated/` imports.
 *
 * @remarks
 * acerpcgen emits `import type { Unsubscribe } from '../types-runtime'`, so this
 * module's path and name are part of the generator's contract, not a free choice.
 * Keep it to the types generated code needs.
 *
 * Nothing here reaches the package's public surface: the one type below exists for
 * a generated interface this package never hands out, and the public channel API
 * spells its own teardown callback inline.
 */

/** Undo a subscription. */
export type Unsubscribe = () => void;
