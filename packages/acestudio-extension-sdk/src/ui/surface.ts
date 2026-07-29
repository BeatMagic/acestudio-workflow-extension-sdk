/**
 * `ctx.ui` — the handle on the window ACE Studio hosts this extension's page in.
 *
 * @remarks
 * Studio owns the window and the webview; an extension owns the page and says where
 * it is. That split is the whole of this file: an announcement, the two ways to ask
 * Studio to re-point what it is showing, and the typed channel the page talks to
 * this process over.
 *
 * Every wire name and payload comes from the generated surface, so this file cannot
 * disagree with the host about what an announcement looks like.
 */

import type { BridgeConnection } from "@timedomain/acestudio-bridge-core";
import { WorkflowUiClient } from "../generated/WorkflowUi.acerpc.js";
import type { ChannelHub, UiChannel } from "./channel.js";
import type { UiProtocol } from "./protocol.js";

/**
 * The capability every verb here rides. Held pre-wire so a session that cannot
 * present a surface is told so by the SDK, in the same shape the host would have
 * refused it in.
 */
const SURFACE_TOKEN = "workflow.ui";

/**
 * What an extension does with the window its page lives in.
 *
 * @public
 */
export interface ExtensionUi {
  /**
   * The URL this extension last announced, or `undefined` before it has announced
   * anything. Declaring `ui: { assets }` announces the served URL during startup, so
   * a paved-road extension finds it already set.
   */
  readonly url: string | undefined;
  /**
   * A view of the page↔process channel, typed to the protocol both sides share.
   *
   * Compile-time only: every view is the one channel, so naming the protocol here
   * costs no runtime machinery, and two views cannot disagree about what is
   * registered. Name the same protocol type the page passes to `connectChannel`.
   *
   * The channel is served alongside the page, so it reaches an extension that declared
   * `ui: { assets }`. One serving its own page serves its own page↔process traffic too,
   * and has no use for this.
   *
   * @example
   * ```ts
   * import type { StemsUi } from "./protocol.js";
   *
   * const channel = ctx.ui.channel<StemsUi>();
   * channel.handle("listStems", ({ trackIndex }) => stemsOf(trackIndex));
   * channel.emit("progress", { done: 1, total: 4 });
   * ```
   */
  channel<P extends UiProtocol>(): UiChannel<P>;
  /**
   * Tell ACE Studio where this extension's page is being served, so it can show it.
   *
   * The direct path for an extension that runs its own server — a framework's dev
   * server, a production Node server, anything that ends up with a URL. Declaring
   * `ui: { assets }` instead has the SDK serve the page and announce it, which is the
   * same call made on the extension's behalf.
   *
   * Announcing again re-points the window, and becomes the URL {@link ExtensionUi.reload}
   * returns to. Studio checks the URL against its own guard first: a page somewhere
   * other than loopback, or on a scheme the guard does not allow, is refused here
   * rather than half-loaded.
   *
   * @throws BridgeError — `CAPABILITY_DENIED` when the session does not reach
   * `workflow.ui`, or whatever the host refused the URL with.
   */
  announceSurface(url: string): Promise<void>;
  /**
   * Reload the page, from the URL last announced. An extension whose page can
   * rebuild itself calls this after a rebuild; one that has announced nothing yet has
   * no page to reload, and the host says so.
   */
  reload(): Promise<void>;
  /**
   * Show a different URL, leaving the announced one alone as the URL a reload
   * returns to. For moving *within* an extension's own UI — a wizard step, a
   * detail view — not for handing the window to somebody else's site.
   */
  navigate(url: string): Promise<void>;
}

/**
 * Build the handler-facing UI handle over an open session.
 *
 * @internal
 */
export function createExtensionUi(connection: BridgeConnection, hub: ChannelHub): ExtensionUi {
  const client = new WorkflowUiClient(connection.peer);
  let announced: string | undefined;
  return {
    get url(): string | undefined {
      return announced;
    },
    channel: <P extends UiProtocol>(): UiChannel<P> => hub.typed<P>(),
    announceSurface: async (url: string) => {
      connection.require(SURFACE_TOKEN);
      await client.workflowUiSurfaceReady({ url });
      // Recorded after the host accepted it: a refused URL is not what a reload
      // should go back to, and `url` reads as "what the window is showing".
      announced = url;
    },
    reload: async () => {
      connection.require(SURFACE_TOKEN);
      await client.workflowUiReload();
    },
    navigate: async (url: string) => {
      connection.require(SURFACE_TOKEN);
      await client.workflowUiNavigate({ url });
    },
  };
}
