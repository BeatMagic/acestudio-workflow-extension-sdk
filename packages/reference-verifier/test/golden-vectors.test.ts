import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { Ajv2020 } from "ajv/dist/2020.js";
import {
  fromBase64,
  sha256Hex,
  toBase64,
  utf8Decode,
  utf8Encode,
} from "@timedomain/workflowext-signed-json";
import {
  certificateStatementSchema,
  signatureBlockSchema,
} from "@timedomain/workflowext-wire-schemas";
import { verifySignedBundle, type TrustedRoot } from "@timedomain/workflowext-verifier";
import { buildSignedBundle, makeTestKeys, SIGNED_AT } from "./helpers.js";

/**
 * Golden byte-stability vectors: signatures cover exact stored bytes, so byte
 * identity is load-bearing. These vectors are checked in and re-verified on
 * every run; a construction change that shifts a single byte fails here.
 * After an INTENDED wire change, regenerate with
 * `UPDATE_GOLDEN_VECTORS=1 npx vitest run --project packages` and review the
 * diff as a contract change.
 */
const VECTORS_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "vectors");

async function buildGoldenFiles(): Promise<Map<string, Uint8Array>> {
  const keys = await makeTestKeys();
  const bundleFiles = [
    { path: "manifest.json", bytes: utf8Encode('{"id":"acestudio.mv-runtime","version":"1.2.3"}') },
    { path: "dist/index.js", bytes: utf8Encode('export const answer = 42;\n') },
  ];
  const signedBundle = await buildSignedBundle(keys, bundleFiles);

  const golden = new Map<string, Uint8Array>();
  for (const file of signedBundle) {
    golden.set(join("bundle", file.path), file.bytes);
  }
  golden.set(
    "intermediate-certificate.json",
    utf8Encode(JSON.stringify(keys.intermediateCertificate)),
  );

  const digests: Record<string, string> = {};
  for (const [path, bytes] of golden) {
    digests[path] = await sha256Hex(bytes);
  }
  golden.set(
    "manifest.json",
    utf8Encode(
      JSON.stringify(
        {
          description:
            "Golden byte-stability vectors for the signing-service wire formats. Keys are throwaway RFC 8032 test seeds; no shipped client ever trusts them.",
          trustedRoot: { keyId: "root-1", publicKey: toBase64(keys.root.publicKey) },
          files: digests,
        },
        null,
        2,
      ),
    ),
  );
  return golden;
}

const UPDATE = process.env.UPDATE_GOLDEN_VECTORS === "1";

describe("golden byte-stability vectors", () => {
  it("checked-in bytes are exactly what the construction produces today", async () => {
    const golden = await buildGoldenFiles();
    if (UPDATE) {
      for (const [path, bytes] of golden) {
        const target = join(VECTORS_DIR, path);
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, bytes);
      }
    }
    for (const [path, bytes] of golden) {
      const target = join(VECTORS_DIR, path);
      expect(existsSync(target), `${path} is checked in`).toBe(true);
      expect(toBase64(new Uint8Array(readFileSync(target))), `${path} bytes are stable`).toBe(
        toBase64(bytes),
      );
    }
  });

  it("checked-in digests match the checked-in bytes", async () => {
    const manifest = JSON.parse(readFileSync(join(VECTORS_DIR, "manifest.json"), "utf-8")) as {
      files: Record<string, string>;
    };
    expect(Object.keys(manifest.files).length).toBeGreaterThan(0);
    for (const [path, digest] of Object.entries(manifest.files)) {
      const bytes = new Uint8Array(readFileSync(join(VECTORS_DIR, path)));
      await expect(sha256Hex(bytes), path).resolves.toBe(digest);
    }
  });

  it("the checked-in bundle verifies through the reference verifier", async () => {
    const manifest = JSON.parse(readFileSync(join(VECTORS_DIR, "manifest.json"), "utf-8")) as {
      trustedRoot: { keyId: string; publicKey: string };
      files: Record<string, string>;
    };
    const roots: TrustedRoot[] = [
      { keyId: manifest.trustedRoot.keyId, publicKey: fromBase64(manifest.trustedRoot.publicKey) },
    ];
    const bundle = Object.keys(manifest.files)
      .filter((path) => path.startsWith("bundle/"))
      .map((path) => ({
        path: path.slice("bundle/".length),
        bytes: new Uint8Array(readFileSync(join(VECTORS_DIR, path))),
      }));

    const verdict = await verifySignedBundle(bundle, roots);
    expect(verdict.ok).toBe(true);
    if (!verdict.ok) return;
    expect(verdict.payload).toMatchObject({
      extensionId: "acestudio.mv-runtime",
      developerId: "acestudio",
      version: "1.2.3",
      signedAt: SIGNED_AT,
    });
  });

  it("the checked-in artifacts validate against the published schemas", () => {
    const ajv = new Ajv2020({ strict: true, allErrors: true });
    ajv.addSchema(signatureBlockSchema);
    ajv.addSchema(certificateStatementSchema);
    const blockId = (signatureBlockSchema as { $id: string }).$id;
    const certId = (certificateStatementSchema as { $id: string }).$id;

    const block = JSON.parse(
      readFileSync(join(VECTORS_DIR, "bundle/_signature/block.json"), "utf-8"),
    ) as { payload: string; chain: Array<{ payload: string }> };
    expect(ajv.getSchema(blockId)!(block), "block envelope").toBe(true);
    expect(
      ajv.getSchema(`${blockId}#/$defs/payload`)!(
        JSON.parse(utf8Decode(fromBase64(block.payload))),
      ),
      "block payload",
    ).toBe(true);

    const certificate = JSON.parse(
      readFileSync(join(VECTORS_DIR, "intermediate-certificate.json"), "utf-8"),
    );
    expect(ajv.getSchema(certId)!(certificate), "certificate envelope").toBe(true);
    expect(
      ajv.getSchema(`${certId}#/$defs/payload`)!(
        JSON.parse(utf8Decode(fromBase64(certificate.payload))),
      ),
      "certificate payload",
    ).toBe(true);
    expect(certificate).toEqual(block.chain[0]);
  });
});
