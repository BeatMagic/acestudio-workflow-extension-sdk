/**
 * Runtime types the generated bindings import.
 *
 * @remarks
 * acerpcgen emits `import type { Unsubscribe } from '../types-runtime'`, so this
 * module's path and name are part of the generator's contract, not a free
 * choice. Keep it to the types generated code needs.
 *
 * `Unsubscribe` is re-exported from the generated capability bindings rather than
 * declared here. Both spellings are `() => void`, so declaring it twice would
 * type-check fine and still be wrong: two declarations of one public name is what
 * makes an API report call the second one `Unsubscribe_2`, and a consumer reading
 * that has to work out whether the difference means anything. It does not.
 */

export type { Unsubscribe } from "./generated/bindings.js";
