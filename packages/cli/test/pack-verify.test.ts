import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { deriveBundleName, packDir, PackError } from "../src/bundle/pack";
import { writeZip } from "../src/bundle/zip";
import { PACK_MODIFIED_AT } from "../src/bundle/constants";
import { verifyBundleBytes } from "../src/verify/verify";
import { loadRoots, DEFAULT_ROOTS_PATH } from "../src/verify/roots";
import { makeTestSigner, rootsOf, signFiles, FIXTURE_SIGNED_AT } from "./fixtures";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "aceworkflow-pack-"));
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("pack", () => {
  it("reads a source tree into sorted POSIX-path entries", async () => {
    await writeFile(join(dir, "manifest.json"), '{"id":"team.demo","version":"1.2.0","displayName":"Demo"}');
    await mkdir(join(dir, "dist"), { recursive: true });
    await writeFile(join(dir, "dist", "index.js"), "export const x = 1;\n");

    const files = await packDir(dir);
    expect(files.map((f) => f.path)).toEqual(["dist/index.js", "manifest.json"]);
    expect(deriveBundleName(files)).toBe("demo-1.2.0.aceworkflow");
  });

  it("refuses a tree carrying a reserved _signature entry", async () => {
    await mkdir(join(dir, "_signature"), { recursive: true });
    await writeFile(join(dir, "_signature", "block.json"), "{}");
    await expect(packDir(dir)).rejects.toBeInstanceOf(PackError);
  });

  it("refuses an empty directory", async () => {
    await expect(packDir(dir)).rejects.toBeInstanceOf(PackError);
  });
});

describe("verify", () => {
  it("accepts a bundle packed then signed with a trusted root", async () => {
    await writeFile(join(dir, "manifest.json"), '{"id":"team.demo","version":"1.2.0","displayName":"Demo"}');
    await mkdir(join(dir, "dist"), { recursive: true });
    await writeFile(join(dir, "dist", "index.js"), "export const x = 1;\n");

    const signer = await makeTestSigner();
    const packed = await packDir(dir);
    const signed = await signFiles(signer, packed, {
      extensionId: "team.demo",
      developerId: "team",
      version: "1.2.0",
    });
    const signedBytes = await writeZip(signed, FIXTURE_SIGNED_AT);

    const result = await verifyBundleBytes(signedBytes, rootsOf(signer));
    expect(result.ok).toBe(true);
    if (!result.ok || !("verdict" in result)) return;
    expect(result.verdict.payload).toMatchObject({
      extensionId: "team.demo",
      developerId: "team",
      version: "1.2.0",
      signedAt: FIXTURE_SIGNED_AT,
    });
  });

  it("rejects a bundle whose content was altered after signing", async () => {
    await writeFile(join(dir, "manifest.json"), '{"id":"team.demo","version":"1.2.0","displayName":"Demo"}');
    const signer = await makeTestSigner();
    const packed = await packDir(dir);
    const signed = await signFiles(signer, packed, {
      extensionId: "team.demo",
      developerId: "team",
      version: "1.2.0",
    });
    // Swap the manifest content for something the signed digest won't cover.
    const tampered = signed.map((f) =>
      f.path === "manifest.json"
        ? { path: f.path, bytes: new TextEncoder().encode('{"id":"team.demo","version":"9.9.9","displayName":"Evil"}') }
        : f,
    );
    const tamperedBytes = await writeZip(tampered, FIXTURE_SIGNED_AT);

    const result = await verifyBundleBytes(tamperedBytes, rootsOf(signer));
    expect(result.ok).toBe(false);
    if (result.ok || !("verdict" in result)) return;
    expect(result.verdict.reason).toBe("file-hash-mismatch");
  });

  it("reports a malformed archive distinctly from a verdict", async () => {
    const result = await verifyBundleBytes(new Uint8Array([1, 2, 3, 4]), []);
    expect(result.ok).toBe(false);
    expect("malformed" in result).toBe(true);
  });
});

describe("roots", () => {
  it("loads the embedded production root", async () => {
    const roots = await loadRoots(DEFAULT_ROOTS_PATH);
    expect(roots.some((root) => root.keyId === "root-1")).toBe(true);
    expect(roots[0]!.publicKey).toHaveLength(32);
  });

  it("loads a base64 root file", async () => {
    const signer = await makeTestSigner();
    const path = join(dir, "roots.json");
    const { rootsFileContent } = await import("./fixtures");
    await writeFile(path, rootsFileContent(signer));
    const roots = await loadRoots(path);
    expect(roots).toHaveLength(1);
    expect(roots[0]!.keyId).toBe("root-1");
    expect(roots[0]!.publicKey).toHaveLength(32);
  });
});

describe("pack determinism", () => {
  it("produces identical bytes for identical trees", async () => {
    await writeFile(join(dir, "manifest.json"), '{"id":"team.demo","version":"1.0.0","displayName":"Demo"}');
    const files = await packDir(dir);
    const a = await writeZip(files, PACK_MODIFIED_AT);
    const b = await writeZip(files, PACK_MODIFIED_AT);
    expect(Array.from(a)).toEqual(Array.from(b));
  });
});
