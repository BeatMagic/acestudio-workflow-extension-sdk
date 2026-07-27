import { mkdtemp, rm } from "node:fs/promises";
import * as net from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createTransportPair, encodeFrame, FrameDecoder, LocalSocketTransport } from "@timedomain/acestudio-bridge-core";

describe("in-memory transport pair", () => {
  it("delivers each end's messages to the other", async () => {
    const { client, host } = createTransportPair();
    const seen: string[] = [];
    host.onMessage((message) => seen.push(message));

    client.send("one");
    client.send("two");
    await Promise.resolve();

    expect(seen).toEqual(["one", "two"]);
  });

  it("never delivers a message inside the sender's own send()", () => {
    const { client, host } = createTransportPair();
    let delivered = false;
    host.onMessage(() => {
      delivered = true;
    });

    client.send("one");

    expect(delivered).toBe(false);
  });

  it("closes both ends once", async () => {
    const { client, host } = createTransportPair();
    let clientCloses = 0;
    let hostCloses = 0;
    client.onClose(() => clientCloses++);
    host.onClose(() => hostCloses++);

    client.close();
    client.close();
    await Promise.resolve();

    expect([clientCloses, hostCloses]).toEqual([1, 1]);
  });
});

describe("length-prefix framing", () => {
  it("round-trips a message through the decoder", () => {
    const decoder = new FrameDecoder();
    expect(decoder.push(encodeFrame("hello"))).toEqual(["hello"]);
  });

  it("reassembles a message split across chunks", () => {
    const frame = encodeFrame("split me");
    const decoder = new FrameDecoder();

    expect(decoder.push(frame.subarray(0, 3))).toEqual([]);
    expect(decoder.push(frame.subarray(3, 7))).toEqual([]);
    expect(decoder.push(frame.subarray(7))).toEqual(["split me"]);
  });

  it("yields every message in a chunk carrying several", () => {
    const decoder = new FrameDecoder();
    const chunk = Buffer.concat([encodeFrame("a"), encodeFrame("b"), encodeFrame("c")]);

    expect(decoder.push(chunk)).toEqual(["a", "b", "c"]);
  });

  it("measures the prefix in bytes, not characters", () => {
    const decoder = new FrameDecoder();
    expect(decoder.push(encodeFrame("音符"))).toEqual(["音符"]);
  });

  it("rejects a frame larger than the cap instead of buffering it", () => {
    const decoder = new FrameDecoder();
    const oversized = Buffer.alloc(4);
    oversized.writeUInt32BE(32 * 1024 * 1024, 0);

    expect(() => decoder.push(oversized)).toThrow(/exceeds/);
  });
});

describe("LocalSocketTransport", () => {
  const cleanups: Array<() => Promise<void> | void> = [];

  afterEach(async () => {
    for (const cleanup of cleanups.splice(0).reverse()) {
      await cleanup();
    }
  });

  /** Listen on a socket in a temp directory and echo every frame back. */
  async function echoServer(): Promise<string> {
    const dir = await mkdtemp(join(tmpdir(), "bridge-core-"));
    const socketPath = join(dir, "bridge.sock");
    const server = net.createServer((socket) => {
      socket.on("data", (chunk: Buffer) => socket.write(chunk));
    });
    await new Promise<void>((resolve) => server.listen(socketPath, resolve));
    cleanups.push(async () => {
      await new Promise<void>((resolve) => server.close(() => resolve()));
      await rm(dir, { recursive: true, force: true });
    });
    return socketPath;
  }

  it("frames messages over a real socket", async () => {
    const transport = await LocalSocketTransport.connect(await echoServer());
    cleanups.push(() => transport.close());

    const echoed = new Promise<string>((resolve) => transport.onMessage(resolve));
    transport.send(JSON.stringify({ jsonrpc: "2.0", method: "bridge.ping" }));

    await expect(echoed).resolves.toBe('{"jsonrpc":"2.0","method":"bridge.ping"}');
  });

  it("reports a close when the server goes away", async () => {
    const socketPath = await echoServer();
    const transport = await LocalSocketTransport.connect(socketPath);
    const closed = new Promise<void>((resolve) => transport.onClose(resolve));

    transport.close();

    await expect(closed).resolves.toBeUndefined();
  });

  it("rejects when nothing is listening", async () => {
    const dir = await mkdtemp(join(tmpdir(), "bridge-core-"));
    cleanups.push(() => rm(dir, { recursive: true, force: true }));

    await expect(LocalSocketTransport.connect(join(dir, "absent.sock"))).rejects.toThrow();
  });
});
