// The extension's entry point — the module ACE Studio runs, and the only one it runs.
//
// `defineExtension` owns the choreography: it reads the spawn environment, dials the
// bridge, runs the handshake, serves and announces the page, then calls `activate`.
// When Studio stops this process it runs `deactivate` inside the grace window and
// exits. What is left is the two handlers below.
import { defineExtension } from "@timedomain/acestudio-extension-sdk";
import { manifest } from "./manifest.js";
import type { {{protocolType}} } from "./protocol.js";

/** How often the heartbeat this extension pushes to its page ticks. */
const TICK_MS = 1_000;

let heartbeat: NodeJS.Timeout | undefined;

export default defineExtension({
  manifest,
  ui: {
    // The paved road: the SDK serves this folder on loopback and tells ACE Studio
    // where it is, before `activate` runs. Relative to the entry script's own
    // directory, which is the bundle root — so this is `dist/ui`.
    assets: "ui",
    // Iterating on the page with a hot-reloading dev server? Announce it here instead:
    //
    //   devServerUrl: "http://127.0.0.1:5173/",
    //
    // It is honored only when ACE Studio dev-loaded this extension, so a packaged
    // bundle that ships the field is served from `assets` as if it were not there.
  },
  activate: async (ctx) => {
    // One channel, typed to the protocol both sides import. Registering handlers is
    // never an error — it is the page reaching them that needs a served page.
    const channel = ctx.ui.channel<{{protocolType}}>();

    // Page → process. The signature comes from `./protocol.ts`, so answering the
    // wrong shape does not compile.
    channel.handle("project", async () => {
      // `ctx.client` is the operation surface, narrowed to the manifest's capability
      // list: this call compiles because the manifest asks for `project.read`.
      const { projectName, isTempProject } = await ctx.client.project.info();
      return { name: projectName === "" ? "Untitled" : projectName, saved: !isTempProject };
    });

    // Process → page. Dropped rather than queued when no page is listening, so emit
    // what is true now and let a page that just connected ask for the rest.
    let count = 0;
    heartbeat = setInterval(() => {
      count += 1;
      channel.emit("tick", { count });
    }, TICK_MS);

    // `console.*` is the app logging story: ACE Studio captures this process's stdout
    // and stderr into the extension's log folder, crash or no crash.
    console.log(`{{extensionName}} is up, serving ${String(ctx.ui.url)}`);
  },
  deactivate: () => {
    clearInterval(heartbeat);
  },
});
