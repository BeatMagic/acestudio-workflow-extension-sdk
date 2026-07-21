import { describe, expect, it } from "vitest";
import { readZip, writeZip, ZipError, type ZipFile } from "../src/bundle/zip";

const LIMITS = { maxEntries: 10_000, maxTotalUncompressedBytes: 96 * 1024 * 1024 };
const enc = new TextEncoder();

function file(path: string, text: string): ZipFile {
  return { path, bytes: enc.encode(text) };
}

describe("zip codec", () => {
  it("round-trips files through write then read", async () => {
    const files = [
      file("manifest.json", '{"id":"team.demo","version":"1.0.0"}'),
      // Highly compressible: forces the deflate branch.
      file("dist/index.js", "x".repeat(4096)),
      file("assets/note.txt", "hello"),
    ];
    const zipped = await writeZip(files, 0);
    const back = await readZip(zipped, LIMITS);
    expect(back.map((f) => f.path)).toEqual(files.map((f) => f.path));
    for (const original of files) {
      const seen = back.find((f) => f.path === original.path)!;
      expect(Array.from(seen.bytes)).toEqual(Array.from(original.bytes));
    }
  });

  it("is deterministic for a fixed modified-at and file order", async () => {
    const files = [file("manifest.json", '{"id":"team.demo","version":"1.0.0"}'), file("a.txt", "content")];
    const first = await writeZip(files, 0);
    const second = await writeZip(files, 0);
    expect(Array.from(first)).toEqual(Array.from(second));
  });

  it("stamping a different modified-at changes the bytes", async () => {
    const files = [file("a.txt", "content")];
    const a = await writeZip(files, 0);
    const b = await writeZip(files, 1_700_000_000);
    expect(Array.from(a)).not.toEqual(Array.from(b));
  });

  it("rejects a truncated archive", async () => {
    await expect(readZip(new Uint8Array(4), LIMITS)).rejects.toBeInstanceOf(ZipError);
  });

  it("enforces the entry-count limit", async () => {
    const files = [file("a.txt", "a"), file("b.txt", "b")];
    const zipped = await writeZip(files, 0);
    await expect(readZip(zipped, { ...LIMITS, maxEntries: 1 })).rejects.toBeInstanceOf(ZipError);
  });
});
