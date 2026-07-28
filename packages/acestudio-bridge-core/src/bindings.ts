/**
 * The runtime that makes the generated bindings callable.
 *
 * @remarks
 * `bindings.ts` is interfaces and tables: the method surface mirroring the
 * canonical operation tree, and what each operation requires. This is the small
 * amount of hand-written code that turns those tables into an object — one
 * async method per operation, each of which checks the session's grant before it
 * spends a round trip, then invokes the operation over the one core-owned wire
 * verb (`operation.invoke`, declared in `Operation.acerpc`) — plus one
 * subscription per observable channel, over the one core-owned notification
 * (`state.changed`, declared in `Change.acerpc`).
 *
 * Nothing here is per-operation or per-channel. Adding either to the catalog
 * changes the generated tables and this file not at all — which is the point: a
 * binding cannot be added while forgetting its gate.
 */

import { decodeBulkFields, encodeBulkFields, type BulkSites } from "./bulk.js";
import { BridgeError } from "./errors.js";
import { capabilityDenied, channelDenied, missingCapabilityRow, type Grant } from "./grant.js";
import {
  BULK_PARAM_FIELDS,
  BULK_RESULT_FIELDS,
  FIELD_CAPABILITIES,
  NOTIFICATION_CHANNELS,
  OPERATIONS,
  REQUIRED_TOKENS,
  type CapabilityToken,
  type ChangeEvent,
  type OperationDescriptor,
  type PreconditionCallOptions,
  type Unsubscribe,
} from "./generated/bindings.js";
import { ChangeClient } from "./generated/Change.acerpc.js";
import { OperationClient, type InvokeParams, type InvokeWarning } from "./generated/Operation.acerpc.js";
import type { BridgePeer } from "./peer.js";

/**
 * The reserved `arguments` key a content fingerprint rides under — the host's
 * `capfp::kFingerprintArgKey`. Inside the arguments rather than on the envelope
 * is the canonical placement (ADR 0088 §5), not an accident of this file.
 */
const FINGERPRINT_ARG_KEY = "fingerprint";

/**
 * The `arguments` key selecting a bulk payload's wire encoding (spec 1501 §8).
 * The descriptor carries the value for an operation that declares it, and the
 * generated params type does not name the key at all — the choice is not a
 * caller's, because `json` would hand back plain number arrays under a signature
 * that promises typed ones.
 */
const BULK_ENCODING_ARG_KEY = "encoding";

/**
 * One generated method, before it is nested under its domain.
 *
 * The arguments are positional and the first one is not always the payload: an
 * operation with no arguments is generated as `method(options?)`, so the runtime
 * reads the descriptor's `takesParams` rather than guessing from what it got.
 */
type BoundMethod = (...args: readonly unknown[]) => Promise<unknown>;

/**
 * An advisory fact about an operation that succeeded (ADR 0083 §2) — the wire
 * warning plus the path that raised it, since a listener sees warnings from every
 * call and the code alone would not say which one.
 *
 * It never means the work failed. A refusal is a {@link BridgeError}; this is the
 * host mentioning something worth knowing on the way past.
 *
 * @public
 */
export interface OperationWarning extends InvokeWarning {
  /** The canonical operation path whose call raised it. */
  readonly path: string;
}

/** Where a binding hands the warnings a call came back with. */
export type WarningSink = (warning: OperationWarning) => void;

/**
 * One table of bulk-field sites, keyed by operation path. Most operations carry
 * no bulk data and so have no row, which is what the `undefined` is: the lookup
 * misses far more often than it hits.
 *
 * @internal
 */
export type BulkTable = Readonly<Record<string, BulkSites>>;

/**
 * The two tables the encode/decode pass walks. Overridable for the same reason
 * `guardCall`'s field table is: the generated ones have no rows until the curve
 * group reaches the catalog, and an unexercised pass is one nobody would notice
 * failing.
 *
 * @internal
 */
export interface BulkTables {
  readonly params: BulkTable;
  readonly result: BulkTable;
}

const GENERATED_BULK_TABLES: BulkTables = { params: BULK_PARAM_FIELDS, result: BULK_RESULT_FIELDS };

/**
 * Build the client the generated `PublicBindings` interface describes.
 *
 * The return type is deliberately loose here and asserted at the seam that hands
 * it out — `BridgeConnection.client`. Every method is built by the same closure
 * from a table row, so there is no per-method type for the compiler to check this
 * construction against; the generated interface is what checks the *callers*.
 */
export function buildBindings(
  peer: BridgePeer,
  grant: Grant,
  warn: WarningSink,
  bulk: BulkTables = GENERATED_BULK_TABLES,
): Record<string, unknown> {
  const client = new OperationClient(peer);
  const root: Record<string, unknown> = {};

  for (const operation of OPERATIONS) {
    const invoke: BoundMethod = async (...args) => {
      const params = operation.takesParams ? args[0] : undefined;
      const options = ((operation.takesParams ? args[1] : args[0]) ?? {}) as PreconditionCallOptions;
      // The pre-wire guard, refusing without a round trip and with the error the
      // host would have sent back.
      const denial = guardCall(grant, operation, params);
      if (denial !== undefined) {
        throw denial;
      }
      const answer = await peer.withDeadline({ timeoutMs: options.timeoutMs, signal: options.signal }, () =>
        client.operationInvoke(invocation(operation, params, options, bulk.params[operation.path])),
      );
      for (const warning of answer.warnings ?? []) {
        warn({ ...warning, path: operation.path });
      }
      return decodeBulkFields(bulk.result[operation.path], answer.data);
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

  bindChannels(peer, grant, root);
  return root;
}

/**
 * Add each declared channel's subscription to its domain group.
 *
 * One wire notification carries every channel, so there is one subscription on
 * the peer and the demultiplexing happens here. There is no subscribe call to
 * make: the host sends a channel to whoever may read it, so what a listener
 * registers is purely local — which is exactly why the guard matters. Without it
 * an ungranted subscription is not an error, it is a callback that never fires,
 * and nothing distinguishes that from a subject that simply has not changed.
 */
function bindChannels(peer: BridgePeer, grant: Grant, root: Record<string, unknown>): void {
  const listeners = new Map<string, Set<(event: ChangeEvent) => void>>();
  new ChangeClient(peer).onStateChanged((event) => {
    // A channel with no listeners — including one this artifact cannot name —
    // is dropped. The host decides what to send; this side decides what it
    // asked to hear about.
    for (const listener of [...(listeners.get(event.channel) ?? [])]) {
      listener(event);
    }
  });

  for (const descriptor of NOTIFICATION_CHANNELS) {
    const subscribe = (listener: (event: ChangeEvent) => void): Unsubscribe => {
      if (!grant.has(descriptor.capability)) {
        throw channelDenied(descriptor.channel, descriptor.capability);
      }
      let group = listeners.get(descriptor.channel);
      if (group === undefined) {
        group = new Set();
        listeners.set(descriptor.channel, group);
      }
      group.add(listener);
      return () => {
        group.delete(listener);
      };
    };
    const domain = (root[domainKey(descriptor.domain)] ??= {}) as Record<string, unknown>;
    domain[descriptor.method] = subscribe;
  }
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
 * Shape one invocation: the arguments with their bulk fields encoded, plus the
 * options that are the host's business. Exported for the tests, which need a
 * descriptor that pins a bulk encoding — the real table has none until the curve
 * group reaches the catalog.
 *
 * @internal
 *
 * Which those are: `waitBusy` and `ifMatch` ask the host to behave differently
 * (ADR 0088), so they go — the wait on the envelope, the fingerprint inside the
 * arguments. `timeoutMs` and `signal` bound the local wait and stay here. The
 * bulk `encoding` also goes, and is the one argument the caller did not supply:
 * the binding pins it because it speaks typed arrays.
 */
export function invocation(
  operation: OperationDescriptor,
  params: unknown,
  options: PreconditionCallOptions,
  bulkParams: BulkSites,
): InvokeParams {
  let args = (encodeBulkFields(bulkParams, params) ?? {}) as Record<string, unknown>;
  if (operation.bulkEncoding !== undefined) {
    args = { ...args, [BULK_ENCODING_ARG_KEY]: operation.bulkEncoding };
  }
  if (options.ifMatch !== undefined) {
    args = { ...args, [FINGERPRINT_ARG_KEY]: checkedFingerprint(operation, options.ifMatch) };
  }
  return { path: operation.path, arguments: args, waitTimeoutMs: options.waitBusy };
}

/**
 * The fingerprint, if this operation is one that checks it.
 *
 * The generated option type already refuses an `ifMatch` anywhere else, so a
 * typed caller cannot reach this. An untyped one can, and forwarding the token
 * would be worse than refusing it: the host accepts a token for an op that never
 * opted into the gate and ignores it (ADR 0088 §5), so the write would look
 * guarded and be unguarded — the exact failure the per-op option type exists to
 * make unsayable.
 */
function checkedFingerprint(operation: OperationDescriptor, ifMatch: string): string {
  if (operation.fingerprintPrecondition) {
    return ifMatch;
  }
  throw new BridgeError({
    code: "INVALID_ARG",
    message: `'${operation.path}' does not check a content fingerprint, so ifMatch would guard nothing`,
    hint: "only an operation whose descriptor sets fingerprintPrecondition accepts ifMatch",
  });
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
