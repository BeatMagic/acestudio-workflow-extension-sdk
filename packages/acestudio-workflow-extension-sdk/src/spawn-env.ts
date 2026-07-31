/**
 * The spawn contract: what ACE Studio puts in an extension process's environment.
 *
 * @remarks
 * Core takes explicit parameters only — it has no idea what spawned it. Reading
 * the environment is this layer's job, because an extension process is always
 * something ACE Studio launched, and the variables below are how it says where the
 * bridge is and who this process is.
 *
 * The names generalize the MV runtime's `ACE_MV_BRIDGE_*` pattern, which is the
 * one that has been in production.
 */

import { ExtensionError } from "./errors.js";

/**
 * The bridge endpoint for this process: a Unix-domain socket path or a Windows
 * named pipe.
 *
 * @public
 */
export const BRIDGE_SOCKET_ENV = "ACE_EXTENSION_BRIDGE_SOCKET";

/**
 * The one-time session token this process authenticates its handshake with.
 *
 * @public
 */
export const BRIDGE_TOKEN_ENV = "ACE_EXTENSION_BRIDGE_TOKEN";

/**
 * Set when ACE Studio loaded this extension from a working folder rather than from an
 * installed bundle — a *dev-loaded* extension, as ADR 0091 §1 defines one.
 *
 * It is what gates the developer affordances that must not reach a user's machine —
 * `ui.devServerUrl` above all. Nothing an extension ships can set it for itself,
 * because the spawn environment is the host's to compose.
 *
 * The rule it enforces is ADR 0094 §11's; the variable carrying the host's answer is
 * this SDK's own, and no ADR names it yet.
 *
 * @public
 */
export const DEV_LOADED_ENV = "ACE_EXTENSION_DEV_LOADED";

/**
 * Set by the dev tooling to turn on the SDK's own logging — the debug mode ADR 0091 §6
 * asks for. The `debug` option on `defineExtension` decides either way when it is
 * passed.
 *
 * Named for the SDK because that is whose operations it reports: it does not put the
 * extension into a debug mode of any kind, and what the extension itself logs is its
 * own business either way.
 *
 * @public
 */
export const DEBUG_ENV = "ACE_EXTENSION_SDK_DEBUG";

/**
 * An environment to read the spawn contract out of.
 *
 * @public
 */
export type Environment = Readonly<Record<string, string | undefined>>;

/**
 * What the spawn environment told this process.
 *
 * @internal
 */
export interface SpawnContract {
  /** Where the bridge is listening. Absent only when the caller brought its own transport. */
  readonly socketPath: string | undefined;
  /** The one-time token the handshake presents. */
  readonly authToken: string;
  /**
   * Whether ACE Studio loaded this extension from a folder. Only the developer
   * affordances read it.
   */
  readonly devLoaded: boolean;
}

/**
 * Read the spawn contract, refusing a process that was not started by ACE Studio.
 *
 * A missing variable is not a case to work around: without the endpoint and the
 * token there is no session to be had, and the honest failure is at startup with a
 * message that says what the process is missing.
 *
 * @throws ExtensionError when a required variable is absent or empty.
 *
 * @internal
 */
export function readSpawnContract(env: Environment, options: { socketPathRequired: boolean }): SpawnContract {
  const socketPath = text(env[BRIDGE_SOCKET_ENV]);
  const authToken = text(env[BRIDGE_TOKEN_ENV]);
  if (options.socketPathRequired && socketPath === undefined) {
    throw noEndpoint();
  }
  if (authToken === undefined) {
    throw noToken();
  }
  return { socketPath, authToken, devLoaded: readFlag(env, DEV_LOADED_ENV) };
}

/**
 * Read one of the environment's boolean flags.
 *
 * `1` and `true` are on and everything else — including `0` and `false` — is off,
 * rather than "any value at all is on". A host that says `ACE_EXTENSION_DEV_LOADED=0`
 * means off, and reading that as on would honor a dev server on a user's machine.
 *
 * @internal
 */
export function readFlag(env: Environment, name: string): boolean {
  const value = text(env[name])?.toLowerCase();
  return value === "1" || value === "true";
}

/** A variable's value, with an unset one and an empty one meaning the same thing. */
function text(value: string | undefined): string | undefined {
  return value === undefined || value.length === 0 ? undefined : value;
}

/**
 * The two variables fail differently, so they say different things. Nothing is
 * missing here that a caller could work around — the point of each message is to
 * name the one thing that would actually fix it.
 */
function noEndpoint(): ExtensionError {
  return new ExtensionError(`the environment has no ${BRIDGE_SOCKET_ENV}, so this process has no bridge to connect to`, {
    hint: "an extension runs as a process ACE Studio spawns; to drive it from a test, pass a transport to defineExtension",
  });
}

function noToken(): ExtensionError {
  return new ExtensionError(
    `the environment has no ${BRIDGE_TOKEN_ENV}, so this process has nothing to authenticate its handshake with`,
    {
      // Deliberately not the transport hint: the token is checked whether or not the
      // caller brought a transport, so suggesting one here would send a developer
      // after the thing that cannot fix it.
      hint: `ACE Studio mints this token per spawn; to drive an extension from a test, set ${BRIDGE_TOKEN_ENV} to the token the host peer expects`,
    },
  );
}
