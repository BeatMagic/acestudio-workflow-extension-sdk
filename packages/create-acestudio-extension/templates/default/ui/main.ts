// The page side of the channel. It talks to this extension's own process and to
// nothing else — there is no capability, token, or bridge here, because the process
// is what holds the session with ACE Studio.
import { connectChannel } from "@timedomain/acestudio-extension-sdk/page";
import type { {{protocolType}} } from "../src/protocol.js";

// The same protocol type the process names, so `call` and `on` below are typed to
// exactly what it declared.
const channel = connectChannel<{{protocolType}}>();

const project = element("project");
const heartbeat = element("heartbeat");

// Process → page. Only what the process pushes from now on: nothing was queued for
// this page before it connected.
channel.on("tick", ({ count }) => {
  heartbeat.textContent = `The process has been up for ${String(count)}s.`;
});

// Page → process. There is no timeout — pass a `signal` if a call of yours needs one.
try {
  const { name, saved } = await channel.call("project");
  project.textContent = saved ? `Open project: ${name}` : `Open project: ${name} (never saved)`;
} catch (error) {
  // A call fails when the handler threw, when nothing handles the name, or when the
  // process cannot be reached. The message is the one the process reported.
  project.textContent = `Could not read the project: ${describe(error)}`;
}

function element(id: string): HTMLElement {
  const found = document.getElementById(id);
  if (found === null) {
    throw new Error(`the page has no #${id}`);
  }
  return found;
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
