/**
 * `defineExtension` — the choreography an extension author does not write.
 *
 * @remarks
 * An extension's entry module calls {@link defineExtension} and nothing else. From
 * there the SDK reads the spawn environment, dials the bridge, runs the canonical
 * handshake, dispatches the invoked command or starts the persistent peer, and
 * — when ACE Studio says it is stopping this process — runs `deactivate` inside the
 * grace window and exits before the hard kill. The author writes handlers.
 *
 * The run is, in order: `activate` (when declared), then the invoked command (when
 * ACE Studio named one). A one-shot exits when those resolve; a persistent peer
 * stays up until it is stopped. A run that would do neither is a configuration
 * error, as is an invoked command with no handler — both fail loud at startup,
 * where the developer is looking.
 */

import {
  connect,
  LocalSocketTransport,
  type BridgeConnection,
  type ShutdownParams,
  type Transport,
} from "@timedomain/acestudio-bridge-core";
import type { ManifestClient } from "./client.js";
import type { ExtensionContext } from "./context.js";
import { describeFailure, ExtensionError } from "./errors.js";
import type { ExtensionManifest } from "./manifest.js";
import { readSpawnContract, type Environment, type SpawnContract } from "./spawn-env.js";

/** The run ended the way it was supposed to. */
const EXIT_OK = 0;

/** A handler threw. */
const EXIT_HANDLER_FAILED = 1;

/** The run never started: the spawn environment, the definition, or the handshake. */
const EXIT_NOT_STARTED = 2;

/** The bridge closed under a running extension. */
const EXIT_BRIDGE_LOST = 3;

/**
 * How much of the shutdown grace window to leave for exiting. `deactivate` gets
 * the rest: being hard-killed halfway through it is worse than logging that it did
 * not finish.
 */
const GRACE_MARGIN_MS = 250;

/**
 * A handler. Whatever it returns is ignored; what matters is when its promise
 * settles, since that is what ends a one-shot run.
 *
 * @public
 */
export type ExtensionHandler<M extends ExtensionManifest> = (context: ExtensionContext<M>) => void | Promise<void>;

/**
 * What an extension is: its manifest, its command handlers, and its lifecycle
 * hooks.
 *
 * The `operations` key is reserved for a later ACE Studio and deliberately absent
 * from this type, so declaring one is a compile error rather than something that
 * quietly does nothing.
 *
 * @public
 */
export interface ExtensionDefinition<M extends ExtensionManifest> {
  /** The manifest module, written `as const satisfies ExtensionManifest`. */
  readonly manifest: M;
  /**
   * One handler per command the extension offers, keyed by command name. A
   * one-shot run is one of these: it is invoked, it runs, the process exits.
   */
  readonly commands?: Readonly<Record<string, ExtensionHandler<M>>>;
  /** Startup for a persistent peer — the place to subscribe, serve, and warm up. */
  readonly activate?: ExtensionHandler<M>;
  /**
   * Wind-down, run once before the process exits: on ACE Studio's stop (inside the
   * grace window), when a one-shot finishes, and on {@link ExtensionContext.exit}.
   * It does not run if `activate` threw — there is nothing wound up to wind down —
   * nor when the bridge drops, since by then every call inside it would fail.
   */
  readonly deactivate?: ExtensionHandler<M>;
}

/**
 * The seams the choreography reads its world through. The defaults *are* the spawn
 * contract, so a shipped extension passes none of this; an extension's own test
 * suite passes all of it, and drives the whole lifecycle over an in-memory
 * transport with no ACE Studio in sight.
 *
 * @public
 */
export interface ExtensionRuntimeOptions {
  /** Where to read the spawn contract from. Defaults to `process.env`. */
  readonly env?: Environment;
  /** A transport to speak over, instead of dialing the socket path from the environment. */
  readonly transport?: Transport;
  /** What ending the run means. Defaults to exiting the process. */
  readonly exit?: (code: number) => void;
}

/**
 * A defined extension. The entry module's default export, so that importing it is
 * enough to start the run — there is nothing for a caller to call, because the only
 * caller is ACE Studio spawning the process.
 *
 * @public
 */
export interface Extension<M extends ExtensionManifest = ExtensionManifest> {
  /** The manifest this extension was defined with. */
  readonly manifest: M;
  /**
   * The code the run exits with, once it is over. Never rejects — a failure is
   * logged where ACE Studio captures it, and reported as the code:
   *
   * - `0` — the run finished, or was stopped, cleanly.
   * - `1` — a handler threw.
   * - `2` — the run never started: no spawn environment, an unknown command, a
   *   refused handshake.
   * - `3` — the bridge closed under a running extension.
   */
  readonly exitCode: Promise<number>;
}

/**
 * Define an extension and start its run.
 *
 * @example
 * ```ts
 * import { defineExtension } from "@timedomain/acestudio-extension-sdk";
 * import { manifest } from "./manifest.js";
 *
 * export default defineExtension({
 *   manifest,
 *   commands: {
 *     "render-stems": async (ctx) => {
 *       const { clips } = await ctx.client.clip.list({ trackIndex: 0 });
 *       console.log(`rendering ${clips.length} clips`);
 *     },
 *   },
 * });
 * ```
 *
 * @public
 */
export function defineExtension<const M extends ExtensionManifest>(
  definition: ExtensionDefinition<M>,
  options: ExtensionRuntimeOptions = {},
): Extension<M> {
  const run = new ExtensionRun(definition, options);
  run.start();
  return { manifest: definition.manifest, exitCode: run.exitCode };
}

/** One extension process's whole life. */
class ExtensionRun<M extends ExtensionManifest> {
  readonly exitCode: Promise<number>;

  private readonly definition: ExtensionDefinition<M>;
  private readonly options: ExtensionRuntimeOptions;
  private readonly exit: (code: number) => void;
  private settleExitCode!: (code: number) => void;
  private connection: BridgeConnection | undefined;
  private context: ExtensionContext<M> | undefined;
  /**
   * Set when `activate` threw, which is the one case with nothing wound up for
   * `deactivate` to wind down. Deliberately not "did activate finish": an activate
   * that calls `ctx.exit()` and ends the run from inside itself did not fail, and
   * its wind-down still has to happen.
   */
  private activateFailed = false;
  /** Set by whichever ending got here first, so the exit path runs once. */
  private ending = false;

  constructor(definition: ExtensionDefinition<M>, options: ExtensionRuntimeOptions) {
    this.definition = definition;
    this.options = options;
    this.exit =
      options.exit ??
      ((code) => {
        process.exit(code);
      });
    this.exitCode = new Promise<number>((resolve) => {
      this.settleExitCode = resolve;
    });
  }

  start(): void {
    void this.run();
  }

  private async run(): Promise<void> {
    let context: ExtensionContext<M>;
    let command: ExtensionHandler<M> | undefined;
    try {
      const contract = readSpawnContract(this.options.env ?? process.env, {
        socketPathRequired: this.options.transport === undefined,
      });
      // Resolved before the session is opened: an extension invoked for a command
      // it does not implement should not have connected in the first place.
      command = this.resolveCommand(contract.command);
      context = this.attach(await this.openSession(contract), contract.command);
    } catch (error) {
      this.abandon(EXIT_NOT_STARTED, `this extension could not start: ${describeFailure(error)}`);
      return;
    }

    const { activate } = this.definition;
    if (activate !== undefined && !(await runHandler("activate", activate, context))) {
      this.activateFailed = true;
      await this.finish(EXIT_HANDLER_FAILED);
      return;
    }
    if (command !== undefined && !(await runHandler("a command", command, context))) {
      await this.finish(EXIT_HANDLER_FAILED);
      return;
    }

    // The one-shot promise: the run is over when the work is, with no exit call
    // for the author to remember. A persistent peer stays up instead — its socket
    // is what keeps the process alive — until ACE Studio stops it or it exits itself.
    if (this.definition.manifest.lifecycle === "one-shot") {
      await this.finish(EXIT_OK);
    }
  }

  /** The handler for the invoked command, or nothing when the run started without one. */
  private resolveCommand(name: string | undefined): ExtensionHandler<M> | undefined {
    if (name === undefined) {
      if (this.definition.activate === undefined) {
        throw new ExtensionError("this run has no command to dispatch and the extension declares no activate", {
          hint: "declare activate for a run that starts without a command, or check what ACE Studio invoked",
        });
      }
      return undefined;
    }
    const handler = this.definition.commands?.[name];
    if (handler === undefined) {
      const declared = Object.keys(this.definition.commands ?? {});
      throw new ExtensionError(
        `ACE Studio invoked the command '${name}', which this extension does not implement`,
        {
          hint:
            declared.length === 0
              ? "this extension declares no commands at all"
              : `it implements ${declared.join(", ")}`,
        },
      );
    }
    return handler;
  }

  private async openSession(contract: SpawnContract): Promise<BridgeConnection> {
    const transport =
      // `readSpawnContract` refused an environment without the endpoint, unless the
      // caller brought a transport of its own — which is the branch above.
      this.options.transport ?? (await LocalSocketTransport.connect(contract.socketPath as string));
    return connect({
      transport,
      authToken: contract.authToken,
      // Sent for the drivers that resolve a request against the registry. The
      // extension host does not: an extension's grant is the consent record from
      // install, and the handshake answers with it either way.
      requestedCapabilities: this.definition.manifest.capabilities,
    });
  }

  /** Build the handlers' context and wire the endings the host can trigger. */
  private attach(connection: BridgeConnection, command: string | undefined): ExtensionContext<M> {
    this.connection = connection;
    const context: ExtensionContext<M> = {
      manifest: this.definition.manifest,
      // The facade is compile-time only: this is the same guarded client core
      // built, narrowed to what the manifest asked for. The guard inside it — not
      // this type — is what refuses a call the grant cannot reach.
      client: connection.client as unknown as ManifestClient<M>,
      grant: connection.grant,
      command,
      exit: (code = EXIT_OK) => {
        void this.finish(code);
      },
    };
    this.context = context;
    connection.onShutdown((params) => {
      void this.finish(EXIT_OK, params);
    });
    connection.onClose(() => {
      this.onBridgeLost();
    });
    return context;
  }

  /**
   * End the run: `deactivate`, close the session, exit. Every deliberate ending
   * comes through here — a one-shot finishing, `ctx.exit()`, and ACE Studio's stop,
   * which brings the grace window `deactivate` has to fit inside.
   */
  private async finish(code: number, shutdown?: ShutdownParams): Promise<void> {
    if (this.ending) {
      return;
    }
    this.ending = true;
    await this.runDeactivate(shutdown?.graceMs);
    this.connection?.close();
    this.settle(code);
  }

  private async runDeactivate(graceMs: number | undefined): Promise<void> {
    const { deactivate } = this.definition;
    if (deactivate === undefined || this.context === undefined || this.activateFailed) {
      return;
    }
    try {
      const work = Promise.resolve(deactivate(this.context));
      if (graceMs === undefined) {
        // No window to fit inside: the ending is the extension's own, and ACE
        // Studio's stop control is what bounds a wedged extension either way.
        await work;
        return;
      }
      if (!(await settlesWithin(work, graceMs))) {
        console.warn(`[ace-studio] deactivate did not finish inside the ${graceMs}ms shutdown grace; exiting anyway`);
      }
    } catch (error) {
      console.error(`[ace-studio] deactivate failed: ${describeFailure(error)}`);
    }
  }

  /**
   * The bridge closed on its own. There is no wind-down to run — every call inside
   * `deactivate` would fail against a session that is gone, and ACE Studio is
   * already reaping this process — so the useful thing left is to stop existing.
   */
  private onBridgeLost(): void {
    if (this.ending) {
      return;
    }
    this.abandon(EXIT_BRIDGE_LOST, "the bridge connection to ACE Studio closed; exiting");
  }

  /** End without a wind-down: nothing was started, or nothing is left to wind down. */
  private abandon(code: number, message: string): void {
    this.ending = true;
    console.error(`[ace-studio] ${message}`);
    this.connection?.close();
    this.settle(code);
  }

  private settle(code: number): void {
    this.settleExitCode(code);
    this.exit(code);
  }
}

/**
 * Run one of the author's handlers, reporting whether it got through. A handler
 * that throws is logged where ACE Studio captures it — the extension's stderr — and
 * ends the run; it is never re-thrown at a caller, because there is nobody above
 * this to catch it.
 */
async function runHandler<M extends ExtensionManifest>(
  label: "activate" | "a command",
  handler: ExtensionHandler<M>,
  context: ExtensionContext<M>,
): Promise<boolean> {
  try {
    await handler(context);
    return true;
  } catch (error) {
    console.error(`[ace-studio] ${label} failed: ${describeFailure(error)}`);
    return false;
  }
}

/**
 * Whether `work` settles inside the grace window, leaving a margin to exit in.
 * A window at or under the margin is used whole — a host that grants that little
 * is not one to shave anything off.
 */
async function settlesWithin(work: Promise<void>, graceMs: number): Promise<boolean> {
  const bound = graceMs <= GRACE_MARGIN_MS ? graceMs : graceMs - GRACE_MARGIN_MS;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      work.then(() => true),
      new Promise<false>((resolve) => {
        timer = setTimeout(() => {
          resolve(false);
        }, bound);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}
