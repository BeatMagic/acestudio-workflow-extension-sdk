/**
 * The Studio side of the surface channel, as far as an extension can tell.
 *
 * ACE Studio's half of `workflow.ui` is a window: it is told where the page is and it
 * shows it. What an extension can observe of that is exactly what this records — the
 * announcements, the reloads, the navigations — and the one thing it can be told is
 * "no", which is what `refuse` stages.
 *
 * The payload types come from the generated surface, so a schema change breaks this
 * script at compile time rather than letting the suite drift away from the wire.
 */

import type { JsonRpcFault } from "@timedomain/acestudio-bridge-core";
import type { NavigateParams, SurfaceReadyParams } from "../../src/generated/WorkflowUi.acerpc.js";

/**
 * The wire names the host spells. Literals, so the script says what goes over the
 * wire — and asserted against the generated capability map in ui.test.ts, which is
 * what keeps them from drifting.
 */
export const SURFACE_METHODS = {
  announce: "workflow.ui.surfaceReady",
  navigate: "workflow.ui.navigate",
  reload: "workflow.ui.reload",
} as const;

/** What the host was told about this extension's surface. */
export class SurfaceWindow {
  /** Every URL announced, in order, including any the window refused. */
  readonly announced: string[] = [];
  /** Every URL navigated to, in order. */
  readonly navigated: string[] = [];
  /** How many reloads were asked for. */
  reloads = 0;
  /**
   * Refuse the next announcement with this fault — how the guard's "that URL is not
   * loopback" reaches an extension.
   */
  refuse: JsonRpcFault | undefined;

  /** The host halves to hand {@link ScriptedHostPeer} through its `methods` option. */
  methods(): Record<string, (params: unknown) => unknown> {
    return {
      [SURFACE_METHODS.announce]: (params: unknown) => {
        this.announced.push((params as SurfaceReadyParams).url);
        const refusal = this.refuse;
        if (refusal !== undefined) {
          this.refuse = undefined;
          throw refusal;
        }
        return null;
      },
      [SURFACE_METHODS.reload]: () => {
        this.reloads += 1;
        return null;
      },
      [SURFACE_METHODS.navigate]: (params: unknown) => {
        this.navigated.push((params as NavigateParams).url);
        return null;
      },
    };
  }
}
