import { beforeAll, describe, expect, it } from "vitest";
import {
  createCertificate,
  createSignedEnvelope,
  generateSigningKey,
  utf8Encode,
} from "@beatmagic/workflowext-signed-json";
import { verifySignedBundle, type TrustedRoot } from "@beatmagic/workflowext-verifier";
import {
  buildSignedBundle,
  CERT_VALID_FROM,
  makeTestKeys,
  type BundleFile,
  type TestKeys,
} from "./helpers";

let keys: TestKeys;
let trustedRoots: TrustedRoot[];

const files: BundleFile[] = [
  { path: "manifest.json", bytes: utf8Encode('{"id":"acestudio.mv-runtime"}') },
  { path: "dist/index.js", bytes: utf8Encode("export {};") },
];

beforeAll(async () => {
  keys = await makeTestKeys();
  trustedRoots = [{ keyId: "root-1", publicKey: keys.root.publicKey }];
});

describe("verifySignedBundle — the client's conclusion (ADR 0089 §4-5)", () => {
  it("accepts a properly signed bundle and returns the verified payload", async () => {
    const bundle = await buildSignedBundle(keys, files);

    const verdict = await verifySignedBundle(bundle, trustedRoots);
    expect(verdict.ok).toBe(true);
    if (!verdict.ok) return;
    expect(verdict.payload.extensionId).toBe("acestudio.mv-runtime");
    expect(verdict.payload.signedAt).toBeGreaterThan(CERT_VALID_FROM);
  });

  it("rejects a bundle with no signature block as missing-signature-block", async () => {
    const verdict = await verifySignedBundle(files, trustedRoots);
    expect(verdict).toMatchObject({ ok: false, reason: "missing-signature-block" });
  });

  it("rejects garbage block bytes as malformed-block", async () => {
    const bundle: BundleFile[] = [
      ...files,
      { path: "_signature/block.json", bytes: utf8Encode("not json") },
    ];
    const verdict = await verifySignedBundle(bundle, trustedRoots);
    expect(verdict).toMatchObject({ ok: false, reason: "malformed-block" });
  });

  it("rejects a tampered file as file-hash-mismatch", async () => {
    const bundle = await buildSignedBundle(keys, files);
    const tampered = bundle.map((f) =>
      f.path === "dist/index.js" ? { ...f, bytes: utf8Encode("export default 666;") } : f,
    );
    const verdict = await verifySignedBundle(tampered, trustedRoots);
    expect(verdict).toMatchObject({ ok: false, reason: "file-hash-mismatch" });
  });

  it("rejects a smuggled file named after an Object.prototype member as unlisted-file", async () => {
    const bundle = await buildSignedBundle(keys, files);
    bundle.push({ path: "constructor", bytes: utf8Encode("evil()") });
    const verdict = await verifySignedBundle(bundle, trustedRoots);
    expect(verdict).toMatchObject({ ok: false, reason: "unlisted-file" });
  });

  it("rejects a smuggled file as unlisted-file", async () => {
    const bundle = await buildSignedBundle(keys, files);
    bundle.push({ path: "dist/extra.js", bytes: utf8Encode("evil()") });
    const verdict = await verifySignedBundle(bundle, trustedRoots);
    expect(verdict).toMatchObject({ ok: false, reason: "unlisted-file" });
  });

  it("rejects an extra file inside the reserved _signature/ directory as unlisted-file", async () => {
    const bundle = await buildSignedBundle(keys, files);
    bundle.push({ path: "_signature/extra.json", bytes: utf8Encode("{}") });
    const verdict = await verifySignedBundle(bundle, trustedRoots);
    expect(verdict).toMatchObject({ ok: false, reason: "unlisted-file" });
  });

  it("rejects a bundle missing a covered file as missing-file", async () => {
    const bundle = await buildSignedBundle(keys, files);
    const withoutIndex = bundle.filter((f) => f.path !== "dist/index.js");
    const verdict = await verifySignedBundle(withoutIndex, trustedRoots);
    expect(verdict).toMatchObject({ ok: false, reason: "missing-file" });
  });

  it("rejects a block signed by a key the chain does not certify", async () => {
    const rogue = await generateSigningKey();
    const payloadBytes = utf8Encode(
      JSON.stringify({
        format: "acestudio.workflowext.signature-block",
        formatVersion: 1,
        extensionId: "acestudio.mv-runtime",
        developerId: "acestudio",
        version: "1.2.3",
        signedAt: CERT_VALID_FROM + 10,
        files: {},
      }),
    );
    const block = await createSignedEnvelope(rogue.privateKey, payloadBytes, [
      keys.intermediateCertificate,
    ]);
    const bundle: BundleFile[] = [
      { path: "_signature/block.json", bytes: utf8Encode(JSON.stringify(block)) },
    ];
    const verdict = await verifySignedBundle(bundle, trustedRoots);
    expect(verdict).toMatchObject({ ok: false, reason: "bad-signature" });
  });

  it("rejects a chain whose certificate no embedded root signed", async () => {
    const rogueRoot = await generateSigningKey();
    const rogueCert = await createCertificate(rogueRoot.privateKey, {
      keyId: "intermediate-1",
      publicKey: keys.intermediate.publicKey,
      role: "intermediate",
      validFrom: CERT_VALID_FROM,
      signedBy: "root-1",
    });
    const bundle = await buildSignedBundle(
      { ...keys, intermediateCertificate: rogueCert },
      files,
    );
    const verdict = await verifySignedBundle(bundle, trustedRoots);
    expect(verdict).toMatchObject({ ok: false, reason: "bad-chain" });
  });

  it("rejects a chain certifying a root-role key for bundle signing", async () => {
    const rootRoleCert = await createCertificate(keys.root.privateKey, {
      keyId: "intermediate-1",
      publicKey: keys.intermediate.publicKey,
      role: "root",
      validFrom: CERT_VALID_FROM,
      signedBy: "root-1",
    });
    const bundle = await buildSignedBundle(
      { ...keys, intermediateCertificate: rootRoleCert },
      files,
    );
    const verdict = await verifySignedBundle(bundle, trustedRoots);
    expect(verdict).toMatchObject({ ok: false, reason: "bad-chain" });
  });

  it("rejects a bundle signed before its signer's validFrom", async () => {
    const bundle = await buildSignedBundle(keys, files, { signedAt: CERT_VALID_FROM - 1 });
    const verdict = await verifySignedBundle(bundle, trustedRoots);
    expect(verdict).toMatchObject({ ok: false, reason: "signer-not-yet-valid" });
  });

  it("rejects a verified payload with a reverse-domain extension id as invalid-payload", async () => {
    const bundle = await buildSignedBundle(keys, files, {
      extensionId: "com.example.tool",
    });
    const verdict = await verifySignedBundle(bundle, trustedRoots);
    expect(verdict).toMatchObject({ ok: false, reason: "invalid-payload" });
  });

  it("accepts under the second embedded root when the first does not match", async () => {
    const otherRoot = await generateSigningKey();
    const roots: TrustedRoot[] = [
      { keyId: "root-2", publicKey: otherRoot.publicKey },
      { keyId: "root-1", publicKey: keys.root.publicKey },
    ];
    const bundle = await buildSignedBundle(keys, files);
    const verdict = await verifySignedBundle(bundle, roots);
    expect(verdict.ok).toBe(true);
  });
});
