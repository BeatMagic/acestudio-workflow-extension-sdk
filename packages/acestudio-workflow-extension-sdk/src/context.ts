/**
 * What a handler is handed: the session, typed down to the manifest.
 */

import type { Grant } from "@timedomain/acestudio-bridge-core";
import type { ManifestClient } from "./client.js";
import type { ExtensionManifest } from "./manifest.js";
import type { ExtensionUi } from "./ui/surface.js";

/**
 * The context every handler receives — one open session, already handshaken, with
 * a client typed to what the manifest asked for.
 *
 * @public
 */
export interface ExtensionContext<M extends ExtensionManifest = ExtensionManifest> {
  /** The manifest this extension was defined with, as written. */
  readonly manifest: M;
  /**
   * The operation surface: `ctx.client.clip.list()`, `ctx.client.transport.play()`
   * — the canonical operation tree, narrowed to the manifest's capability request.
   * A call the manifest does not ask for is a compile error here.
   */
  readonly client: ManifestClient<M>;
  /**
   * What the session actually reaches. Normally the expansion of the manifest's
   * request, which is what the user consented to at install — read it when an
   * extension can do useful work with only part of what it asked for.
   */
  readonly grant: Grant;
  /**
   * The window ACE Studio hosts this extension's page in, and the typed channel
   * between that page and this process. An extension that declared `ui: { assets }`
   * finds its page already served and announced.
   */
  readonly ui: ExtensionUi;
  /**
   * End the run: `deactivate`, then exit with `code` (`0` by default). The natural
   * ending for a workflow that is done, or one the user cancelled from the
   * extension's own UI.
   *
   * ACE Studio's stop control does not depend on this — it works even when an
   * extension is wedged — so this is a convenience for a clean ending, never the
   * only way out.
   */
  exit(code?: number): void;
}
