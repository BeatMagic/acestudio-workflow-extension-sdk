/**
 * The connection core for programming against a running ACE Studio.
 *
 * @remarks
 * This is the package skeleton; the public API is introduced in subsequent
 * releases.
 *
 * @packageDocumentation
 */

/**
 * Placeholder export that anchors the package's public surface while the
 * skeleton has no API yet.
 *
 * @public
 */
export const packageName = "@timedomain/acestudio-bridge-core";

// The generated capability bindings (ADR 0094 §2). Regenerated in the Studio
// repo by `cargo run -p ace_command_catalog --bin gen_sdk_bindings`; this copy
// arrives by regen PR and is drift-gated there. Do not edit it here.
export * from "./generated/bindings.js";
