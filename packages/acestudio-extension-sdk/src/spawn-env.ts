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

/** The bridge endpoint for this process: a Unix-domain socket path or a Windows named pipe. */
export const BRIDGE_SOCKET_ENV = "ACE_EXTENSION_BRIDGE_SOCKET";

/** The one-time session token this process authenticates its handshake with. */
export const BRIDGE_TOKEN_ENV = "ACE_EXTENSION_BRIDGE_TOKEN";

/**
 * The command being invoked, for a run that started from one. A one-shot workflow
 * is spawned per invocation, so the command a user picked is known at spawn time
 * and travels here rather than over the bridge.
 */
export const COMMAND_ENV = "ACE_EXTENSION_COMMAND";

/** An environment to read the spawn contract out of. */
export type Environment = Readonly<Record<string, string | undefined>>;

/** What the spawn environment told this process. */
export interface SpawnContract {
  /** Where the bridge is listening. Absent only when the caller brought its own transport. */
  readonly socketPath: string | undefined;
  /** The one-time token the handshake presents. */
  readonly authToken: string;
  /** The invoked command's name, when the run started from one. */
  readonly command: string | undefined;
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
  return { socketPath, authToken, command: text(env[COMMAND_ENV]) };
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
