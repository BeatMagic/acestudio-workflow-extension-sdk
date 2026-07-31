/**
 * Driving a real extension run with no ACE Studio in sight.
 *
 * The scripted host peer from bridge-core's tests sits on one end of an in-memory
 * transport pair and `defineExtension` on the other, so a test exercises the whole
 * choreography — spawn contract, handshake, activate, wind-down, exit — through the
 * same seam a shipped extension uses. Nothing here mocks the layer under test: the
 * only things the harness stands in for are the two the process cannot have inside a
 * test runner, its socket and its exit.
 *
 * The peer is reached by path rather than through a package entry because it is test
 * support, not published API — and reusing it is what keeps this suite honest about
 * what the host actually says.
 */

import { createTransportPair } from "@timedomain/acestudio-bridge-core";
import { ScriptedHostPeer, type ScriptedHostOptions } from "../../../acestudio-bridge-core/test/support/host-peer.js";
import {
  defineExtension,
  type Extension,
  type ExtensionDefinition,
  type ExtensionManifest,
} from "@timedomain/acestudio-workflow-extension-sdk";
import { BRIDGE_TOKEN_ENV } from "../../src/spawn-env.js";

/** The one-time token the harness's scripted host minted for the process. */
export const AUTH_TOKEN = "one-time-token";

/** What the harness stages around a run. */
export interface RunOptions {
  /** What the scripted host grants and how it answers operations. */
  host?: ScriptedHostOptions;
  /**
   * The spawn environment, replacing the harness's default (the auth token). For the
   * cases where a variable's *absence* is the subject.
   */
  env?: Record<string, string | undefined>;
  /** Turn SDK debug logging on by option, rather than through the environment. */
  debug?: boolean;
}

/** A running extension, and the host on the other end of it. */
export interface Run<M extends ExtensionManifest> {
  readonly extension: Extension<M>;
  readonly host: ScriptedHostPeer;
  /** The code the run ended with. */
  readonly exitCode: Promise<number>;
}

/** Start a run against a scripted host. */
export function startRun<const M extends ExtensionManifest>(
  definition: ExtensionDefinition<M>,
  options: RunOptions = {},
): Run<M> {
  const { client, host: hostTransport } = createTransportPair();
  const host = new ScriptedHostPeer(hostTransport, { authToken: AUTH_TOKEN, ...options.host });
  const extension = defineExtension(definition, {
    transport: client,
    env: options.env ?? { [BRIDGE_TOKEN_ENV]: AUTH_TOKEN },
    // The run's exit is observed through `extension.exitCode`; a real
    // `process.exit` would take the test runner with it.
    exit: () => {},
    ...(options.debug === undefined ? {} : { debug: options.debug }),
  });
  return { extension, host, exitCode: extension.exitCode };
}

/** A promise plus the handle to settle it — how a test waits for a handler to be reached. */
export interface Signal<T> {
  readonly reached: Promise<T>;
  announce(value: T): void;
}

export function signal<T = void>(): Signal<T> {
  let announce!: (value: T) => void;
  const reached = new Promise<T>((resolve) => {
    announce = resolve;
  });
  return { reached, announce };
}
