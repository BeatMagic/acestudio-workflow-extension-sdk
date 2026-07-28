/**
 * The runtime that makes the generated bindings callable.
 *
 * @remarks
 * `bindings.ts` is interfaces and tables: the method surface mirroring the
 * canonical operation tree, and what each operation requires. This is the small
 * amount of hand-written code that turns those tables into an object — one
 * async method per operation, each of which checks the session's grant before it
 * spends a round trip, then invokes the operation over the one core-owned wire
 * verb (`operation.invoke`, declared in `Operation.acerpc`).
 *
 * Nothing here is per-operation. Adding an operation to the catalog changes the
 * generated tables and this file not at all — which is the point: a binding
 * cannot be added while forgetting its gate.
 */

import type { BridgeError } from "./errors.js";
import { capabilityDenied, missingCapabilityRow, type Grant } from "./grant.js";
import {
  FIELD_CAPABILITIES,
  OPERATIONS,
  REQUIRED_TOKENS,
  type CapabilityToken,
  type MutatingCallOptions,
} from "./generated/bindings.js";
import { OperationClient, type InvokeParams } from "./generated/Operation.acerpc.js";
import type { BridgePeer } from "./peer.js";

/**
 * The reserved `arguments` key a content fingerprint rides under — the host's
 * `capfp::kFingerprintArgKey`. Inside the arguments rather than on the envelope
 * is the canonical placement (ADR 0088 §5), not an accident of this file.
 */
const FINGERPRINT_ARG_KEY = "fingerprint";

/**
 * One generated method, before it is nested under its domain.
 *
 * The arguments are positional and the first one is not always the payload: an
 * operation with no arguments is generated as `method(options?)`, so the runtime
 * reads the descriptor's `takesParams` rather than guessing from what it got.
 */
type BoundMethod = (...args: readonly unknown[]) => Promise<unknown>;

/**
 * Build the client the generated `PublicBindings` interface describes.
 *
 * The return type is deliberately loose here and asserted at the seam that hands
 * it out — `BridgeConnection.client`. Every method is built by the same closure
 * from a table row, so there is no per-method type for the compiler to check this
 * construction against; the generated interface is what checks the *callers*.
 */
export function buildBindings(peer: BridgePeer, grant: Grant): Record<string, unknown> {
  const client = new OperationClient(peer);
  const root: Record<string, unknown> = {};

  for (const operation of OPERATIONS) {
    const invoke: BoundMethod = async (...args) => {
      const params = operation.takesParams ? args[0] : undefined;
      const options = ((operation.takesParams ? args[1] : args[0]) ?? {}) as MutatingCallOptions;
      // The pre-wire guard, refusing without a round trip and with the error the
      // host would have sent back.
      const denial = guardCall(grant, operation, params);
      if (denial !== undefined) {
        throw denial;
      }
      const answer = await peer.withDeadline({ timeoutMs: options.timeoutMs, signal: options.signal }, () =>
        client.operationInvoke(invocation(operation.path, params, options)),
      );
      reportWarnings(operation.path, answer.warnings);
      return answer.data;
    };

    // Read as a plain string: the table's literal types say no operation sits at
    // the root *today*, and the emitter still supports one, so comparing against
    // the literal union would make this branch a type error rather than a
    // forward-compatible one.
    const domain: string = operation.domain;
    if (domain === "") {
      root[operation.method] = invoke;
      continue;
    }
    const group = (root[domainKey(domain)] ??= {}) as Record<string, unknown>;
    group[operation.method] = invoke;
  }

  return root;
}

/**
 * The refusal an operation's own token earns it, or `undefined` to proceed. An
 * ungated operation is a registry-declared pure function and needs no token; a
 * gated one with no row in the table is refused rather than sent, which is what
 * the host does with a command it can find no capability for — a table this side
 * cannot read is not a reason to try the call.
 */
function operationDenial(
  grant: Grant,
  operation: { path: string; ungated: boolean },
): BridgeError<"CAPABILITY_DENIED"> | undefined {
  if (operation.ungated) {
    return undefined;
  }
  const token = REQUIRED_TOKENS[operation.path as keyof typeof REQUIRED_TOKENS] as CapabilityToken | undefined;
  if (token === undefined) {
    return missingCapabilityRow(operation.path);
  }
  return grant.has(token) ? undefined : capabilityDenied(operation.path, token);
}

/**
 * The whole pre-wire check for one call: the operation's token, then any gated
 * argument field it actually set (ADR 0071 tier 2). Exported for the tests, which
 * need to drive the field half against a table with rows in it — the generated
 * one has none yet, and an unexercised gate is one nobody would notice failing.
 *
 * @internal
 */
export function guardCall(
  grant: Grant,
  operation: { path: string; ungated: boolean },
  params: unknown,
  fieldTable: Readonly<Record<string, Readonly<Record<string, CapabilityToken>>>> = FIELD_CAPABILITIES,
): BridgeError<"CAPABILITY_DENIED"> | undefined {
  return operationDenial(grant, operation) ?? fieldDenial(grant, operation.path, params, fieldTable);
}

/**
 * The refusal a capability-gated argument field earns (ADR 0071 tier 2). Only a
 * field the caller actually set is checked: the gate exists so an ungranted
 * session may still make the call without that field, which is why these are
 * optional in the generated params type.
 */
function fieldDenial(
  grant: Grant,
  path: string,
  params: unknown,
  fieldTable: Readonly<Record<string, Readonly<Record<string, CapabilityToken>>>>,
): BridgeError<"CAPABILITY_DENIED"> | undefined {
  const gated = fieldTable[path];
  if (gated === undefined || params === null || typeof params !== "object") {
    return undefined;
  }
  const args = params as Record<string, unknown>;
  for (const [field, token] of Object.entries(gated)) {
    if (args[field] !== undefined && !grant.has(token)) {
      return capabilityDenied(`${path} --${field}`, token);
    }
  }
  return undefined;
}

/**
 * Shape one invocation. The guardrail options are the only ones that reach the
 * host: `timeoutMs` and `signal` bound the local wait and are none of its
 * business, while `waitBusy` and `ifMatch` are asking the host to behave
 * differently (ADR 0088).
 */
function invocation(path: string, params: unknown, options: MutatingCallOptions): InvokeParams {
  const args = (params ?? {}) as Record<string, unknown>;
  return {
    path,
    arguments: options.ifMatch === undefined ? args : { ...args, [FINGERPRINT_ARG_KEY]: options.ifMatch },
    waitTimeoutMs: options.waitBusy,
  };
}

/**
 * Surface the advisory warnings an operation came back with (ADR 0083 §2).
 *
 * `console.warn` because that is the SDK's logging story — Studio captures the
 * extension's stdio (ADR 0091 §5) — and because the alternative is dropping
 * them: the binding's return type is the operation's payload, and where a
 * first-class warnings surface belongs is an open question, not something to
 * settle by silently discarding the field.
 */
function reportWarnings(path: string, warnings: readonly { code: string; hint?: string }[] | undefined): void {
  for (const warning of warnings ?? []) {
    console.warn(`[ace-studio] ${path}: ${warning.code}${warning.hint === undefined ? "" : ` — ${warning.hint}`}`);
  }
}

/**
 * Turns `special-tracks` into `specialTracks`. The canonical tree spells a
 * multi-word domain with a hyphen and the binding surface camelCases it, so a
 * descriptor's `domain` is not directly a key of the generated client. `Camel<S>`
 * in `scoped.ts` is the type-level counterpart and has to agree; exported so a
 * caller — the tests included — reaches for this rather than writing the regex
 * again.
 *
 * @internal
 */
export function domainKey(domain: string): string {
  return domain.replace(/-([a-z])/g, (_match, letter: string) => letter.toUpperCase());
}
