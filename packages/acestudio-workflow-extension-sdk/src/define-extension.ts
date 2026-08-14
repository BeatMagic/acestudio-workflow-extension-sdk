/**
 * `defineExtension` — the choreography an extension author does not write.
 *
 * @remarks
 * An extension's entry module calls {@link defineExtension} and nothing else. From
 * there the SDK reads the spawn environment, dials the bridge, runs the canonical
 * handshake, hands the session to `activate`, and — when ACE Studio says it is
 * stopping this process — runs `deactivate` inside the grace window and exits before
 * the hard kill. The author writes handlers.
 *
 * `activate` is the one entry point, under either lifecycle policy: a one-shot's run
 * is over when it resolves, and a persistent peer stays up until it is stopped. What
 * happens inside is the extension's own business — the UI it draws is where its user
 * decides what to run, and the SDK has no say in it.
 */

import {
  connect,
  createDebugLog,
  LocalSocketTransport,
  type BridgeConnection,
  type DebugLog,
  type ProjectRelocatedParams,
  type ShutdownParams,
  type Transport,
} from "@timedomain/acestudio-bridge-core";
import type { ManifestClient } from "./client.js";
import type { ExtensionContext } from "./context.js";
import { describeFailure, ExtensionError } from "./errors.js";
import type { ExtensionManifest } from "./manifest.js";
import { DEBUG_ENV, readFlag, readSpawnContract, type Environment, type SpawnContract } from "./spawn-env.js";
import { ChannelHub } from "./ui/channel.js";
import { AssetRegistry } from "./ui/assets.js";
import { CHANNEL_ORIGIN_PARAM } from "./ui/protocol.js";
import { serveUi, type ExtensionUiOptions, type UiServer } from "./ui/server.js";
import { createExtensionUi } from "./ui/surface.js";

/** The run ended the way it was supposed to. */
const EXIT_OK = 0;

/** A handler threw. */
const EXIT_HANDLER_FAILED = 1;

/**
 * The run never started: the spawn environment, the definition, the handshake, or
 * the UI it declared.
 */
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
 * The token whose holder is asked to quiesce, and told when the move is over.
 * Requesting it in the manifest is what makes {@link ExtensionDefinition.quiesce}
 * mandatory.
 */
const SESSION_MOVE = "session.move";

/**
 * What {@link ExtensionDefinition.resume} is handed: where the project folder is
 * now. Unchanged from what the extension already had means the move was abandoned.
 *
 * @public
 */
export type ProjectRelocation = ProjectRelocatedParams;

/**
 * The resume half of the move exchange, handed where the project folder ended up.
 *
 * @public
 */
export type ExtensionResumeHandler<M extends ExtensionManifest> = (
  context: ExtensionContext<M>,
  relocation: ProjectRelocation,
) => void | Promise<void>;

/**
 * What an extension is: its manifest, its entry point, and its wind-down.
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
   * The extension's one entry point, and the whole of what the SDK will call. A
   * one-shot's run is over when it resolves; a persistent peer serves its UI from
   * here and stays up. Nothing about *what* the extension does belongs to the
   * platform: the user decides that in the interface the extension draws.
   */
  readonly activate: ExtensionHandler<M>;
  /**
   * The UI paved road: point it at the built page and the SDK serves it on loopback
   * and announces the URL to ACE Studio before `activate` runs.
   *
   * Optional because it is a convenience, not the way in. An extension that runs its
   * own server — a framework's production server, a dev server — leaves this out and
   * calls `ctx.ui.announceSurface(url)` with its own URL.
   */
  readonly ui?: ExtensionUiOptions;
  /**
   * Wind-down, run once before the process exits: on ACE Studio's stop (inside the
   * grace window), when a one-shot finishes, and on {@link ExtensionContext.exit}.
   * It does not run if `activate` threw — there is nothing wound up to wind down —
   * nor when the bridge drops, since by then every call inside it would fail.
   */
  readonly deactivate?: ExtensionHandler<M>;
  /**
   * Stop writing under the project folder, so ACE Studio can relocate it — a
   * Save-As, or the first save of a project that until now lived in a temporary
   * one. Flush what is in flight and release every handle you hold there, then
   * resolve. The save blocks until you do.
   *
   * This is not a request the extension may decline. ACE Studio does not wait past
   * its deadline, and an extension that cannot stop writing is in a state to fix
   * rather than one to report — so there is no way to answer "no", and throwing
   * says the extension is broken, not that it refused.
   *
   * Do not finish long work here. Checkpoint it and pick it up in
   * {@link ExtensionDefinition.resume}, and stay stopped until then: reopening as
   * soon as this resolves would race the copy the ack just authorized.
   *
   * Required when the manifest requests `session.move`, and refused otherwise —
   * the token is the duty, and an extension holding it with no hook would have ACE
   * Studio told the folder was quiesced by a peer that never stopped writing. An
   * extension that holds nothing open declares an empty one, which says so.
   */
  readonly quiesce?: ExtensionHandler<M>;
  /**
   * The move is over and the extension may write again, told where the project
   * folder is now — the destination on a committed move, the path it already had
   * on an abandoned one, which is what makes an unchanged value a bare "carry on".
   *
   * Runs on both endings, because a quiesced extension that is never told parks
   * for good. Optional: an extension that reopens nothing needs no resume, and one
   * that holds only paths it recomputes needs none either.
   */
  readonly resume?: ExtensionResumeHandler<M>;
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
  /**
   * Log what the SDK does — the lifecycle, every call and how it ended, the channel
   * and the assets served — to stderr, where ACE Studio's stdio capture lands it in
   * the extension's log folder (ADR 0091 §5).
   *
   * Defaults to what `ACE_EXTENSION_SDK_DEBUG` says, which is how dev tooling turns it
   * on without the extension being rebuilt for it.
   *
   * There is no wire trace here, on purpose (ADR 0091 §6): a line names the operation
   * and how it ended, plus the URLs this SDK serves and announces, which are what a
   * developer is usually chasing. What a call carried — its arguments, its result, and
   * the session token — is never written.
   */
  readonly debug?: boolean;
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
   * - `2` — the run never started: no spawn environment, a refused handshake, or a
   *   declared UI that could not be served or announced.
   * - `3` — the bridge closed under a running extension.
   */
  readonly exitCode: Promise<number>;
}

/**
 * Define an extension and start its run.
 *
 * @example
 * ```ts
 * import { defineExtension } from "@timedomain/acestudio-workflow-extension-sdk";
 * import { manifest } from "./manifest.js";
 *
 * export default defineExtension({
 *   manifest,
 *   activate: async (ctx) => {
 *     const { clips } = await ctx.client.clip.list({ trackIndex: 0 });
 *     console.log(`rendering ${clips.length} clips`);
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
  private readonly debugEnabled: boolean;
  private readonly debug: DebugLog;
  /**
   * The one channel behind every typed view of it. Owned by the run rather than by
   * the server, so `ctx.ui.channel()` is the same object whether or not this extension
   * took the paved road — registering handlers on it is never an error, it is the page
   * reaching them that needs a served page.
   */
  private readonly hub: ChannelHub;
  /**
   * Every asset served at runtime, owned by the run for the same reason: `serveAsset`
   * is one object for the whole run, and a URL is what happens to be reachable while
   * a server is up.
   */
  private readonly assets = new AssetRegistry();
  private settleExitCode!: (code: number) => void;
  private connection: BridgeConnection | undefined;
  private context: ExtensionContext<M> | undefined;
  private server: UiServer | undefined;
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
    // Read before anything else can fail, so a run that never starts still says why
    // when the developer asked to be told.
    this.debugEnabled = options.debug ?? readFlag(options.env ?? process.env, DEBUG_ENV);
    this.debug = createDebugLog(this.debugEnabled);
    this.hub = new ChannelHub(this.debug);
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
    try {
      // Before the socket: a definition that contradicts its own manifest is
      // wrong wherever it runs, and saying so without a bridge in the way is what
      // makes it read as the author's mistake rather than a connection problem.
      this.requireMoveHandlersToMatchManifest();
      const contract = readSpawnContract(this.options.env ?? process.env, {
        socketPathRequired: this.options.transport === undefined,
      });
      context = this.attach(await this.openSession(contract));
      // Before `activate`, so a handler that emits on the channel or reads
      // `ctx.ui.url` finds the page already served and announced.
      await this.servePavedRoad(context, contract);
    } catch (error) {
      this.abandon(EXIT_NOT_STARTED, `this extension could not start: ${describeFailure(error)}`);
      return;
    }

    this.debug("lifecycle: activate");
    try {
      await this.definition.activate(context);
      this.debug("lifecycle: activate returned");
    } catch (error) {
      // The run can already be over: ACE Studio's stop landed mid-handler, or the
      // handler called `ctx.exit()` itself. An `activate` that then rejects because
      // the session was closed under it did not fail the run, and logging that it
      // did would tell the developer their extension broke when the user stopped it.
      if (this.ending) {
        return;
      }
      this.activateFailed = true;
      console.error(`[ace-studio] activate failed: ${describeFailure(error)}`);
      await this.finish(EXIT_HANDLER_FAILED);
      return;
    }

    // The one-shot promise: the run is over when the work is, with no exit call for
    // the author to remember. A persistent peer stays up instead — its socket is
    // what keeps the process alive — until ACE Studio stops it or it exits itself.
    // Either way `finish` runs once, so an `activate` that already ended the run
    // keeps the code it asked for.
    if (this.definition.manifest.lifecycle === "one-shot") {
      await this.finish(EXIT_OK);
    }
  }

  /**
   * The manifest's `session.move` request and the `quiesce` hook have to agree,
   * in both directions.
   *
   * Requesting the token without the hook is the shape that matters: core acks
   * `ready: true` when no hook is supplied, which is right for a peer holding
   * nothing open but a false assurance from one that asked to be asked — ACE
   * Studio would copy the folder while this extension kept writing to it. The run
   * refuses to start rather than carry that, since it is the author's own
   * declaration and every save afterwards would be the one that corrupts.
   *
   * The other direction is a dead hook: a peer without the token is never called,
   * so a `quiesce` that can never run means the manifest is missing the token the
   * author thought they had.
   *
   * @throws ExtensionError when the two disagree.
   */
  private requireMoveHandlersToMatchManifest(): void {
    const requested = this.definition.manifest.capabilities.includes(SESSION_MOVE);
    const declared = this.definition.quiesce !== undefined;
    if (requested === declared) {
      return;
    }
    throw requested
      ? new ExtensionError(`this extension requests \`${SESSION_MOVE}\` but declares no \`quiesce\``, {
          hint:
            "write `quiesce` to stop writing under the project folder and release your handles — " +
            "an empty one if this extension holds nothing open, which says so rather than leaving it assumed",
        })
      : new ExtensionError(`this extension declares \`quiesce\` but does not request \`${SESSION_MOVE}\``, {
          hint: `add "${SESSION_MOVE}" to the manifest's \`capabilities\`, or drop \`quiesce\` — without the token ACE Studio never asks, so it would never run`,
        });
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
      // Core keeps its own log rather than being handed this one: the option is what
      // its public surface takes, and one boolean is what decides both.
      debug: this.debugEnabled,
      // Handed to `connect` rather than registered afterwards, because core serves
      // this before the handshake goes out: the host can ask as soon as the session
      // lands, and a hook attached a tick later would miss that call and let the
      // default ack answer for an extension that had not stopped writing.
      onPrepareMove: this.definition.quiesce === undefined ? undefined : () => this.runQuiesce(),
    });
  }

  /**
   * Run the author's quiesce, and let a failure through.
   *
   * The rethrow is load-bearing: core turns a rejection into a fault, which the
   * host reads as unsafe and fails the move on. Swallowing it the way
   * `deactivate` failures are swallowed would ack `ready: true` for an extension
   * that never stopped writing, and ACE Studio would copy the folder under it.
   */
  private async runQuiesce(): Promise<void> {
    const { quiesce } = this.definition;
    // No context yet means the host asked between the handler being served and
    // `activate` being reached, so no handler of this extension's has run and it
    // holds nothing under the project folder. The default ack is honest there.
    if (quiesce === undefined || this.context === undefined) {
      return;
    }
    this.debug("lifecycle: quiesce");
    try {
      await quiesce(this.context);
      this.debug("lifecycle: quiesce returned");
    } catch (error) {
      console.error(`[ace-studio] quiesce failed: ${describeFailure(error)}`);
      throw error;
    }
  }

  /**
   * Tell the author where the project folder went. A failure stops here — this
   * answers nothing, so there is nowhere for it to go but the log, and the run is
   * otherwise healthy.
   */
  private async runResume(relocation: ProjectRelocation): Promise<void> {
    const { resume } = this.definition;
    this.debug(`lifecycle: the project move ended at ${relocation.projectFolder}`);
    if (resume === undefined || this.context === undefined) {
      return;
    }
    this.debug("lifecycle: resume");
    try {
      await resume(this.context, relocation);
    } catch (error) {
      console.error(`[ace-studio] resume failed: ${describeFailure(error)}`);
    }
  }

  /**
   * Serve and announce the declared page, so the window has something to show before
   * the extension's own code runs. An extension that runs its own server declared
   * nothing here and announces for itself.
   *
   * The loopback server goes up either way — it is what carries the channel and the
   * served assets — and what changes when a dev server is honored is only which URL ACE
   * Studio is pointed at.
   */
  private async servePavedRoad(context: ExtensionContext<M>, contract: SpawnContract): Promise<void> {
    const { ui } = this.definition;
    if (ui === undefined) {
      return;
    }
    const devServer = this.honoredDevServerUrl(ui, contract.devLoaded);
    this.server = await serveUi({
      // The dev server owns the page while it is honored, so the built assets are not
      // served beside it: a request landing on a stale build would be a confusing
      // thing to debug, and the build may not even exist yet mid-loop.
      pageRoot: devServer === undefined ? ui.assets : undefined,
      hub: this.hub,
      assets: this.assets,
      pageUrl: devServer,
      debug: this.debug,
    });
    this.assets.publishAt(this.server.url);
    await context.ui.announceSurface(
      devServer === undefined ? this.server.url : pageUrlReachingChannel(devServer, this.server.url),
    );
  }

  /**
   * The dev server to announce, or `undefined` to serve the built page.
   *
   * The gate is the host's word, not the extension's: `devServerUrl` is honored only
   * when ACE Studio says it spawned this extension dev-loaded (ADR 0094 §11), so a
   * packaged bundle that ships the field is served from its assets as if the field
   * were not there rather than pointing a user's window at nothing.
   *
   * A URL that will not parse is refused here, before anything is served, so that the
   * one place that decides whether to honor it is also the one place that decides
   * whether it is a URL at all.
   *
   * @throws ExtensionError when `devServerUrl` is not a URL.
   */
  private honoredDevServerUrl(ui: ExtensionUiOptions, devLoaded: boolean): string | undefined {
    if (ui.devServerUrl === undefined) {
      return undefined;
    }
    if (!devLoaded) {
      this.debug("ui: `devServerUrl` is declared, but this extension was not dev-loaded — serving the built page");
      return undefined;
    }
    requireUrl(ui.devServerUrl);
    this.debug(`ui: dev-loaded, so announcing the dev server at ${ui.devServerUrl}`);
    return ui.devServerUrl;
  }

  /** Build the handler's context and wire the endings the host can trigger. */
  private attach(connection: BridgeConnection): ExtensionContext<M> {
    this.connection = connection;
    const context: ExtensionContext<M> = {
      manifest: this.definition.manifest,
      // The facade is compile-time only: this is the same guarded client core
      // built, narrowed to what the manifest asked for. The guard inside it — not
      // this type — is what refuses a call the grant cannot reach.
      client: connection.client as unknown as ManifestClient<M>,
      grant: connection.grant,
      ui: createExtensionUi({ connection, hub: this.hub, assets: this.assets, debug: this.debug }),
      exit: (code = EXIT_OK) => {
        void this.finish(code);
      },
    };
    this.context = context;
    connection.onShutdown((params) => {
      void this.finish(EXIT_OK, params);
    });
    // Subscribed whether or not `resume` was declared, so the debug log shows the
    // move ending either way — an extension that parked and never came back is the
    // failure this exchange exists to prevent, and silence here is what it looks
    // like.
    connection.onProjectRelocated((params) => {
      void this.runResume(params);
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
    // After the wind-down: a `deactivate` that flushes a last progress event to its
    // page should still find the page there.
    await this.stopServing();
    this.connection?.close();
    this.settle(code);
  }

  /**
   * Stop serving the page. A failure here changes nothing about how the run ends —
   * the process is about to exit and the OS closes the listener either way — so it is
   * logged rather than allowed to replace the ending already decided.
   */
  private async stopServing(): Promise<void> {
    try {
      await this.server?.close();
    } catch (error) {
      console.warn(`[ace-studio] the UI server did not shut down cleanly: ${describeFailure(error)}`);
    }
    this.server = undefined;
  }

  private async runDeactivate(graceMs: number | undefined): Promise<void> {
    const { deactivate } = this.definition;
    if (deactivate === undefined || this.context === undefined || this.activateFailed) {
      return;
    }
    this.debug("lifecycle: deactivate");
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
    // Not awaited: this path is reached from a listener as well as from `run`, so it
    // cannot be async without making a dropped bridge an unhandled rejection. The
    // listener is closed either way — by this call, or by the process exiting.
    void this.stopServing();
    this.connection?.close();
    this.settle(code);
  }

  private settle(code: number): void {
    this.debug(`lifecycle: exiting with ${String(code)}`);
    this.settleExitCode(code);
    this.exit(code);
  }
}

/**
 * The dev server's URL with the channel's origin attached, which is what makes the
 * paved road's channel reachable from a page the paved road is not serving.
 *
 * A page served by its own extension finds the channel on its own origin and needs
 * none of this. A page on a dev server's port cannot — and cannot be told the port
 * ahead of time either, since the OS picks it at startup — so the announced URL
 * carries it, and `connectChannel()` in the page reads it before falling back.
 *
 * @throws ExtensionError when `devServerUrl` is not a URL.
 */
function pageUrlReachingChannel(pageUrl: string, channelUrl: string): string {
  const announced = requireUrl(pageUrl);
  announced.searchParams.set(CHANNEL_ORIGIN_PARAM, new URL(channelUrl).origin);
  return announced.toString();
}

/**
 * A declared `devServerUrl`, parsed. The one place that decides whether the field is a
 * URL, so that everything downstream — whose origin the channel accepts, what gets
 * announced — is working from the same answer.
 *
 * @throws ExtensionError when it will not parse. It is the developer's own declaration
 * and this is the run that is about to use it, so saying which field is wrong beats
 * announcing something the window cannot load.
 */
function requireUrl(pageUrl: string): URL {
  try {
    return new URL(pageUrl);
  } catch {
    throw new ExtensionError(`\`ui.devServerUrl\` is not a URL: ${pageUrl}`, {
      hint: "write the dev server's address in full, scheme and port included — http://127.0.0.1:5173/",
    });
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
