// What this extension's page and its process say to each other, written once and
// imported by both — `src/index.ts` names it at `ctx.ui.channel<…>()`, `ui/main.ts`
// names it at `connectChannel<…>()`. A handler that answers the wrong shape, a call
// with the wrong parameters, an event nobody declared: all compile errors, on
// whichever side made the mistake.
//
// Types only, no imports beyond the type below: this module is compiled into the
// Node bundle and the browser bundle both.
import type { UiProtocol } from "@timedomain/acestudio-workflow-extension-sdk";

export interface {{protocolType}} extends UiProtocol {
  /** What the page asks the process, and what it gets back. */
  calls: {
    /** Read the open project's name and whether it has been saved anywhere yet. */
    project(): Promise<{ name: string; saved: boolean }>;
  };
  /** What the process pushes to the page, unasked. */
  events: {
    /** A heartbeat, so the page can show that its process is alive. */
    tick: { count: number };
  };
}
