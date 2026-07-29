/**
 * Served assets, against the real loopback server: what an opaque URL serves, how it
 * answers a byte range, and what happens to it once it is revoked.
 *
 * Range support is the whole reason this exists rather than a channel call, so it is
 * exercised by asking for ranges over HTTP and reading what comes back — the same
 * requests a `<video>` makes when the user drags its scrubber.
 */

import { Readable } from "node:stream";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { afterEach, expect, test } from "vitest";
import { uiHarness } from "./support/served-ui.js";

const ui = uiHarness();
afterEach(ui.teardown);

/** Twenty-six bytes whose every offset is legible in a failure message. */
const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

/** A file of known bytes inside the run's own assets directory. */
async function fileOfBytes(directory: string, name: string, contents: string): Promise<string> {
  const path = join(directory, name);
  await writeFile(path, contents, "utf8");
  return path;
}

test("a served file is reachable at an opaque URL that says nothing about where it came from", async () => {
  const { context, assets } = await ui.startServed();
  const path = await fileOfBytes(assets, "vocals.wav", ALPHABET);

  const handle = context.ui.serveAsset(path);

  expect(handle.url).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/__ace\/asset\/[0-9a-f]{32}$/);
  expect(handle.url).not.toContain("vocals");
  const served = await fetch(handle.url);
  expect(served.status).toBe(200);
  expect(served.headers.get("content-type")).toBe("audio/wav");
  expect(served.headers.get("accept-ranges")).toBe("bytes");
  expect(served.headers.get("content-length")).toBe(String(ALPHABET.length));
  await expect(served.text()).resolves.toBe(ALPHABET);
});

test("a byte range is answered as one, with the span and the total size", async () => {
  const { context, assets } = await ui.startServed();
  const handle = context.ui.serveAsset(await fileOfBytes(assets, "take.wav", ALPHABET));

  const part = await fetch(handle.url, { headers: { range: "bytes=2-5" } });

  expect(part.status).toBe(206);
  expect(part.headers.get("content-range")).toBe(`bytes 2-5/${String(ALPHABET.length)}`);
  expect(part.headers.get("content-length")).toBe("4");
  await expect(part.text()).resolves.toBe("cdef");
});

test("an open-ended range runs to the end, and a suffix range counts back from it", async () => {
  const { context, assets } = await ui.startServed();
  const handle = context.ui.serveAsset(await fileOfBytes(assets, "take.wav", ALPHABET));

  const toEnd = await fetch(handle.url, { headers: { range: "bytes=23-" } });
  expect(toEnd.status).toBe(206);
  expect(toEnd.headers.get("content-range")).toBe("bytes 23-25/26");
  await expect(toEnd.text()).resolves.toBe("xyz");

  const fromEnd = await fetch(handle.url, { headers: { range: "bytes=-3" } });
  expect(fromEnd.status).toBe(206);
  expect(fromEnd.headers.get("content-range")).toBe("bytes 23-25/26");
  await expect(fromEnd.text()).resolves.toBe("xyz");
});

test("a range past the end is refused with the size the player should have asked inside", async () => {
  const { context, assets } = await ui.startServed();
  const handle = context.ui.serveAsset(await fileOfBytes(assets, "take.wav", ALPHABET));

  const refused = await fetch(handle.url, { headers: { range: "bytes=99-200" } });

  expect(refused.status).toBe(416);
  expect(refused.headers.get("content-range")).toBe("bytes */26");
});

test("bytes held in memory are served the same way, under the type they were given", async () => {
  const { context } = await ui.startServed();
  const handle = context.ui.serveAsset(new TextEncoder().encode(ALPHABET), { contentType: "audio/mpeg" });

  const whole = await fetch(handle.url);
  expect(whole.headers.get("content-type")).toBe("audio/mpeg");
  await expect(whole.text()).resolves.toBe(ALPHABET);

  const part = await fetch(handle.url, { headers: { range: "bytes=0-1" } });
  expect(part.status).toBe(206);
  await expect(part.text()).resolves.toBe("ab");
});

test("a HEAD asks how big the asset is without moving it", async () => {
  const { context, assets } = await ui.startServed();
  const handle = context.ui.serveAsset(await fileOfBytes(assets, "take.wav", ALPHABET));

  const head = await fetch(handle.url, { method: "HEAD" });

  expect(head.status).toBe(200);
  expect(head.headers.get("content-length")).toBe("26");
  await expect(head.text()).resolves.toBe("");
});

test("a stream is served whole and once, and says it cannot seek", async () => {
  const { context } = await ui.startServed();
  const handle = context.ui.serveAsset(Readable.from([ALPHABET]), { contentType: "audio/wav" });

  // A range is asked for and ignored: a stream has no way back to a byte it passed, so
  // the whole body is the honest answer rather than a 206 that would be a lie.
  const first = await fetch(handle.url, { headers: { range: "bytes=2-5" } });
  expect(first.status).toBe(200);
  expect(first.headers.get("accept-ranges")).toBe("none");
  await expect(first.text()).resolves.toBe(ALPHABET);

  // The bytes are gone now, and saying so beats handing a player an empty body it
  // would report as a corrupt file.
  const second = await fetch(handle.url);
  expect(second.status).toBe(410);
});

test("revoking a handle stops its URL resolving, and leaves every other handle alone", async () => {
  const { context, assets } = await ui.startServed();
  const revoked = context.ui.serveAsset(await fileOfBytes(assets, "one.wav", ALPHABET));
  const kept = context.ui.serveAsset(await fileOfBytes(assets, "two.wav", "still here"));

  expect(revoked.url).not.toBe(kept.url);
  expect((await fetch(revoked.url)).status).toBe(200);

  revoked.revoke();

  expect((await fetch(revoked.url)).status).toBe(404);
  // Twice is not an error: a page that closed and an extension that tidied up may
  // both decide the same URL is finished with.
  expect(() => revoked.revoke()).not.toThrow();
  await expect((await fetch(kept.url)).text()).resolves.toBe("still here");
});

test("revoking a stream nobody read closes it", async () => {
  const { context } = await ui.startServed();
  const source = Readable.from([ALPHABET]);
  const handle = context.ui.serveAsset(source, { contentType: "audio/wav" });

  handle.revoke();

  // Serving a stream hands it over, so once the URL is gone nothing else is left holding
  // it — and an unread source still owns whatever it was reading from.
  expect(source.destroyed).toBe(true);
});

test("a stream that was read is left alone, having closed itself on the way out", async () => {
  const { context } = await ui.startServed();
  const source = Readable.from([ALPHABET]);
  const handle = context.ui.serveAsset(source, { contentType: "audio/wav" });

  await expect((await fetch(handle.url)).text()).resolves.toBe(ALPHABET);
  handle.revoke();

  // Nothing to assert about a descriptor here — the point is that revoking a stream mid
  // transfer is not how it gets cut off, which the served bytes above already showed.
  expect(source.readableEnded).toBe(true);
});

test("a file that has gone away is a 404, not a broken response", async () => {
  const { context, assets } = await ui.startServed();
  const handle = context.ui.serveAsset(join(assets, "never-written.wav"));

  expect((await fetch(handle.url)).status).toBe(404);
});

test("serving an asset once the run has stopped is refused, not handed a URL nothing answers", async () => {
  const { run, context } = await ui.startServed();

  context.exit(0);
  await expect(run.exitCode).resolves.toBe(0);

  // The port is gone, so minting a URL for it would hand the page a link that resolves
  // to nothing. It is a different mistake from never having taken the paved road, and it
  // gets its own words rather than the advice to declare `ui: { assets }`.
  expect(() => context.ui.serveAsset(new TextEncoder().encode("late"))).toThrow(/stopped serving its page/);
});

test("an extension serving its own page is told it has nowhere to serve an asset from", async () => {
  const { context } = await ui.startBare();

  expect(() => context.ui.serveAsset("/tmp/anything.wav")).toThrow(/nowhere to serve an asset from/);
});

test("stopping the run stops serving every asset, and closes the streams none of them read", async () => {
  const { run, context, assets } = await ui.startServed();
  const handle = context.ui.serveAsset(await fileOfBytes(assets, "take.wav", ALPHABET));
  const unread = Readable.from([ALPHABET]);
  context.ui.serveAsset(unread, { contentType: "audio/wav" });

  context.exit(0);
  await expect(run.exitCode).resolves.toBe(0);

  await expect(fetch(handle.url)).rejects.toThrow();
  // An extension may serve a render it turns out nobody asks for. The run ending is the
  // last chance to let go of it, so it is taken.
  expect(unread.destroyed).toBe(true);
});
