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
    throw notSpawnedByStudio(BRIDGE_SOCKET_ENV);
  }
  if (authToken === undefined) {
    throw notSpawnedByStudio(BRIDGE_TOKEN_ENV);
  }
  return { socketPath, authToken };
}

/** A variable's value, with an unset one and an empty one meaning the same thing. */
function text(value: string | undefined): string | undefined {
  return value === undefined || value.length === 0 ? undefined : value;
}

function notSpawnedByStudio(variable: string): ExtensionError {
  return new ExtensionError(`the environment has no ${variable}, so this process has no bridge to connect to`, {
    hint: "an extension runs as a process ACE Studio spawns; to drive it from a test, pass a transport to defineExtension",
  });
}
