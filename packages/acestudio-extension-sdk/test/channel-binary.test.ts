/**
 * Bytes over the typed channel: the frame that carries them, and a real page talking
 * to a real process through it.
 *
 * The frame is tested directly because it is the part with edges — which values are
 * lifted out, which are left for `JSON.stringify`, what a malformed frame does. The
 * round trip is tested over the shipped loopback server and the shipped `./page`
 * entry, because "an upload actually arrives as bytes" is the claim, and a stand-in
 * on either end would prove only that the stand-in agreed.
 */

import { afterEach, describe, expect, test } from "vitest";
import type { UiProtocol } from "@timedomain/acestudio-extension-sdk";
import {
  BINARY_CONTENT_TYPE,
  decodeMessage,
  encodeMessage,
  hasBinary,
  JSON_CONTENT_TYPE,
} from "../src/ui/binary.js";
import { eventually, uiHarness } from "./support/served-ui.js";

const ui = uiHarness();
afterEach(ui.teardown);

/** A protocol whose calls carry bytes in both directions. */
interface UploadUi extends UiProtocol {
  calls: {
    /** Bytes going in, beside ordinary JSON fields. */
    upload(params: { name: string; bytes: Uint8Array }): Promise<{ name: string; size: number }>;
    /** Bytes coming back out. */
    render(params: { seconds: number }): { audio: Uint8Array; peak: number };
    /** Several, nested where a walk has to find them. */
    stems(params: { takes: { name: string; bytes: Uint8Array }[] }): string[];
    ping(): string;
  };
  events: {
    progress: { done: number };
    /** Declared so the refusal has something to be declared against. */
    preview: { audio: Uint8Array };
  };
}

const SAMPLES = new Uint8Array([0, 1, 2, 253, 254, 255]);

function bytesOf(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

describe("the frame", () => {
  test("a message with no bytes in it stays plain JSON", async () => {
    const encoded = await encodeMessage({ id: 1, name: "ping", params: { trackIndex: 0 } });

    expect(encoded.contentType).toBe(JSON_CONTENT_TYPE);
    expect(decodeMessage(encoded.contentType, encoded.body)).toEqual({
      id: 1,
      name: "ping",
      params: { trackIndex: 0 },
    });
  });

  test("bytes anywhere in a message are carried, and arrive as the bytes they were", async () => {
    const message = {
      id: 7,
      name: "upload",
      params: { name: "vocals", takes: [{ bytes: SAMPLES }, { bytes: bytesOf("second") }], count: 2 },
    };

    const encoded = await encodeMessage(message);
    expect(encoded.contentType).toBe(BINARY_CONTENT_TYPE);
    const decoded = decodeMessage(encoded.contentType, encoded.body) as typeof message;

    expect(decoded.params.name).toBe("vocals");
    expect(decoded.params.count).toBe(2);
    expect(decoded.params.takes[0]?.bytes).toEqual(SAMPLES);
    expect(decoded.params.takes[1]?.bytes).toEqual(bytesOf("second"));
  });

  test("what a page has instead of a `Uint8Array` is carried too, and arrives as one", async () => {
    // A file input hands out a `Blob`, a decoded audio buffer hands out a
    // `Float32Array`, and neither survives `JSON.stringify` — a typed array would go
    // out as an object of numbered keys. All three become bytes here.
    const samples = new Float32Array([1, -1]);
    const encoded = await encodeMessage({
      blob: new Blob([SAMPLES]),
      buffer: bytesOf("raw").buffer,
      samples,
    });
    const decoded = decodeMessage(encoded.contentType, encoded.body) as Record<string, Uint8Array>;

    expect(decoded.blob).toEqual(SAMPLES);
    expect(decoded.buffer).toEqual(bytesOf("raw"));
    expect(decoded.samples).toEqual(new Uint8Array(samples.buffer));
  });

  test("a value that is not bytes and not plain is left for JSON to decide", async () => {
    const when = new Date("2026-07-29T00:00:00.000Z");

    const encoded = await encodeMessage({ when, bytes: SAMPLES });
    const decoded = decodeMessage(encoded.contentType, encoded.body) as { when: string };

    expect(decoded.when).toBe(when.toISOString());
  });

  test("a frame that does not describe its own body is refused rather than half-read", () => {
    expect(() => decodeMessage(BINARY_CONTENT_TYPE, new Uint8Array([1, 2]))).toThrow(/too short/);
    // A header claiming a JSON section longer than the body there is.
    expect(() => decodeMessage(BINARY_CONTENT_TYPE, new Uint8Array([0, 0, 0, 200, 123]))).toThrow(
      /does not describe its body/,
    );
  });

  test("`hasBinary` sees bytes wherever they are, and nowhere else", () => {
    expect(hasBinary({ takes: [{ bytes: SAMPLES }] })).toBe(true);
    expect(hasBinary([1, "two", { three: new ArrayBuffer(1) }])).toBe(true);
    expect(hasBinary({ done: 1, total: 4, name: "vocals" })).toBe(false);
    expect(hasBinary(undefined)).toBe(false);
  });
});

describe("a call over the served channel", () => {
  test("carries bytes to the process and back again", async () => {
    const { context, url } = await ui.startServed();
    const channel = context.ui.channel<UploadUi>();
    const received: Uint8Array[] = [];
    channel.handle("upload", ({ name, bytes }) => {
      received.push(bytes);
      return Promise.resolve({ name, size: bytes.byteLength });
    });
    channel.handle("render", ({ seconds }) => ({ audio: bytesOf(`rendered ${String(seconds)}s`), peak: 0.5 }));

    const page = ui.openPage<UploadUi>(url);

    await expect(page.call("upload", { name: "vocals", bytes: SAMPLES })).resolves.toEqual({
      name: "vocals",
      size: SAMPLES.byteLength,
    });
    // The bytes the handler was handed are the bytes the page sent, byte for byte —
    // which is the whole claim, and what a JSON channel could not have managed.
    expect(received[0]).toEqual(SAMPLES);
    expect(received[0]).toBeInstanceOf(Uint8Array);

    const answer = await page.call("render", { seconds: 2 });
    expect(answer.peak).toBe(0.5);
    expect(new TextDecoder().decode(answer.audio)).toBe("rendered 2s");
  });

  test("carries several, nested inside the parameter", async () => {
    const { context, url } = await ui.startServed();
    const channel = context.ui.channel<UploadUi>();
    channel.handle("stems", ({ takes }) => takes.map((take) => `${take.name}:${String(take.bytes.byteLength)}`));

    const page = ui.openPage<UploadUi>(url);

    await expect(
      page.call("stems", {
        takes: [
          { name: "lead", bytes: SAMPLES },
          { name: "harmony", bytes: bytesOf("longer take") },
        ],
      }),
    ).resolves.toEqual(["lead:6", "harmony:11"]);
  });

  test("a call with no bytes still works, and the channel is unchanged by the ones that do", async () => {
    const { context, url } = await ui.startServed();
    const channel = context.ui.channel<UploadUi>();
    channel.handle("ping", () => "pong");
    channel.handle("upload", ({ bytes }) => Promise.resolve({ name: "u", size: bytes.byteLength }));

    const page = ui.openPage<UploadUi>(url);

    await expect(page.call("upload", { name: "u", bytes: SAMPLES })).resolves.toEqual({ name: "u", size: 6 });
    await expect(page.call("ping")).resolves.toBe("pong");
  });

  test("an event carrying bytes is refused at the emit, not silently stringified", async () => {
    const { context, url } = await ui.startServed();
    const channel = context.ui.channel<UploadUi>();
    channel.handle("ping", () => "pong");
    const page = ui.openPage<UploadUi>(url);
    const pushed: unknown[] = [];
    page.on("progress", (payload) => pushed.push(payload));

    expect(() => channel.emit("preview", { audio: SAMPLES })).toThrow(/cannot/);

    // The channel still works, and the events that are JSON still arrive: one refused
    // push is not a broken stream.
    await expect(page.call("ping")).resolves.toBe("pong");
    await eventually(() => {
      channel.emit("progress", { done: 1 });
      return pushed.length > 0;
    });
  });

  test("a body that is not a frame at all is a refusal, not a crash", async () => {
    const { url } = await ui.startServed();

    const response = await fetch(new URL("/__ace/channel", url), {
      method: "POST",
      headers: { "content-type": BINARY_CONTENT_TYPE },
      body: new Uint8Array([9, 9]),
    });

    expect(response.status).toBe(400);
    // Still serving: one unreadable body cost that one request.
    expect((await fetch(url)).status).toBe(200);
  });
});
