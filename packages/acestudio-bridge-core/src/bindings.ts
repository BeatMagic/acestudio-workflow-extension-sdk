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

import { capabilityDenied, type Grant } from "./grant.js";
import { OPERATIONS, REQUIRED_TOKENS, type MutatingCallOptions } from "./generated/bindings.js";
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
 * it out ({@link BridgeConnection.client}): every method is built by the same
 * closure from a table row, so there is no per-method type for the compiler to
 * check this construction against — the generated interface is what checks the
 * *callers*.
 */
export function buildBindings(peer: BridgePeer, grant: Grant): Record<string, unknown> {
  const client = new OperationClient(peer);
  const root: Record<string, unknown> = {};

  for (const operation of OPERATIONS) {
    const invoke: BoundMethod = async (...args) => {
      const params = operation.takesParams ? args[0] : undefined;
      const options = ((operation.takesParams ? args[1] : args[0]) ?? {}) as MutatingCallOptions;
      // The pre-wire guard. An ungated operation is a registry-declared pure
      // function and needs no token; every other one is refused here, without a
      // round trip, with the error the host would have sent back.
      if (!operation.ungated) {
        const token = REQUIRED_TOKENS[operation.path as keyof typeof REQUIRED_TOKENS];
        if (token !== undefined && !grant.has(token)) {
          throw capabilityDenied(operation.path, token);
        }
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
    const group = (root[camelCase(domain)] ??= {}) as Record<string, unknown>;
    group[operation.method] = invoke;
  }

  return root;
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
 * Turns `special-tracks` into `specialTracks`. The canonical tree spells a multi-word
 * domain with a hyphen and the binding surface camelCases it, so the descriptor
 * table's `domain` is not directly a key of the generated client. The type-level
 * counterpart of this lives in `scoped.ts`, and the two have to agree.
 */
function camelCase(domain: string): string {
  return domain.replace(/-([a-z])/g, (_match, letter: string) => letter.toUpperCase());
}
