import { describe, expect, it } from "vitest";
import {
  createSignedEnvelope,
  fromHex,
  importSigningKeyFromSeed,
  utf8Encode,
  type SigningKey,
} from "@timedomain/workflowext-signed-json";
import { keyDirectorySchema } from "@timedomain/workflowext-wire-schemas";
import {
  KEY_ID_PATTERN,
  verifyKeyDirectory,
  verifyRootRevocation,
  type TrustedRoot,
} from "@timedomain/workflowext-verifier";
import { INTERMEDIATE_SEED, makeTestKeys, ROOT_SEED } from "./helpers.js";

const NOW = 1_752_969_600;

async function makeRoot(): Promise<{ key: SigningKey; trusted: TrustedRoot }> {
  const key = await importSigningKeyFromSeed(fromHex(ROOT_SEED));
  return { key, trusted: { keyId: "root-1", publicKey: key.publicKey } };
}

function directoryPayload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    format: "acestudio.workflowext.key-directory",
    formatVersion: 1,
    sequence: 1,
    issuedAt: NOW,
    signedBy: "root-1",
    intermediates: [],
    revokedIntermediates: [],
    rootRevocations: [],
    ...overrides,
  };
}

function revocationPayload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    format: "acestudio.workflowext.root-revocation",
    formatVersion: 1,
    revokedKeyId: "root-2",
    revokedFrom: NOW,
    reason: "drill",
    signedBy: "root-1",
    ...overrides,
  };
}

async function signedBytes(key: SigningKey, payload: Record<string, unknown>): Promise<Uint8Array> {
  const envelope = await createSignedEnvelope(key.privateKey, utf8Encode(JSON.stringify(payload)));
  return utf8Encode(JSON.stringify(envelope));
}

describe("verifyKeyDirectory", () => {
  it("accepts a root-signed directory carrying an intermediate certificate", async () => {
    const { key, trusted } = await makeRoot();
    const { intermediateCertificate } = await makeTestKeys();
    const bytes = await signedBytes(key, directoryPayload({ intermediates: [intermediateCertificate] }));

    const verdict = await verifyKeyDirectory(bytes, [trusted]);
    expect(verdict.ok).toBe(true);
    if (verdict.ok) {
      expect(verdict.payload.sequence).toBe(1);
      expect(verdict.root.keyId).toBe("root-1");
    }
  });

  it("rejects a directory signed by an untrusted key", async () => {
    const { key } = await makeRoot();
    const other = await importSigningKeyFromSeed(fromHex(INTERMEDIATE_SEED));
    const bytes = await signedBytes(key, directoryPayload());
    const verdict = await verifyKeyDirectory(bytes, [{ keyId: "other", publicKey: other.publicKey }]);
    expect(verdict).toEqual({ ok: false, reason: "untrusted-signer" });
  });

  it("rejects an envelope carrying a chain — the directory is root-signed directly", async () => {
    const { key, trusted } = await makeRoot();
    const envelope = await createSignedEnvelope(
      key.privateKey,
      utf8Encode(JSON.stringify(directoryPayload())),
      [],
    );
    const verdict = await verifyKeyDirectory(utf8Encode(JSON.stringify(envelope)), [trusted]);
    expect(verdict).toEqual({ ok: false, reason: "malformed-envelope" });
  });

  it("rejects tampered bytes and non-envelope JSON", async () => {
    const { key, trusted } = await makeRoot();
    const bytes = await signedBytes(key, directoryPayload());
    bytes[bytes.length - 3] ^= 0x01;
    expect((await verifyKeyDirectory(bytes, [trusted])).ok).toBe(false);
    expect(await verifyKeyDirectory(utf8Encode("{}"), [trusted])).toEqual({
      ok: false,
      reason: "malformed-envelope",
    });
  });

  it("rejects structurally invalid payloads that a real root signed", async () => {
    const { key, trusted } = await makeRoot();
    const invalid = [
      directoryPayload({ sequence: 0 }),
      directoryPayload({ format: "acestudio.workflowext.trust-registry" }),
      directoryPayload({ signedBy: "Root-1" }),
      directoryPayload({ extra: true }),
      directoryPayload({ revokedIntermediates: [{ keyId: "x", revokedFrom: -1 }] }),
      directoryPayload({ intermediates: [{ payload: "not base64!", signature: "x" }] }),
    ];
    for (const payload of invalid) {
      const verdict = await verifyKeyDirectory(await signedBytes(key, payload), [trusted]);
      expect(verdict).toEqual({ ok: false, reason: "invalid-payload" });
    }
  });

  it("rejects an envelope item carrying extra keys", async () => {
    const { key, trusted } = await makeRoot();
    const { intermediateCertificate } = await makeTestKeys();
    const bytes = await signedBytes(
      key,
      directoryPayload({ intermediates: [{ ...intermediateCertificate, extra: true }] }),
    );
    expect(await verifyKeyDirectory(bytes, [trusted])).toEqual({
      ok: false,
      reason: "invalid-payload",
    });
  });

  it("rejects a signedBy naming a different key than the one that verified", async () => {
    const { key, trusted } = await makeRoot();
    const bytes = await signedBytes(key, directoryPayload({ signedBy: "root-2" }));
    expect(await verifyKeyDirectory(bytes, [trusted])).toEqual({
      ok: false,
      reason: "signer-mismatch",
    });
  });

  it("keyId rule matches the wire schemas (drift guard)", () => {
    const schemaPattern = (keyDirectorySchema as { $defs: { keyId: { pattern: string } } }).$defs
      .keyId.pattern;
    expect(KEY_ID_PATTERN.source).toBe(schemaPattern);
  });
});

describe("verifyRootRevocation", () => {
  it("accepts a statement signed by an embedded root", async () => {
    const { key, trusted } = await makeRoot();
    const verdict = await verifyRootRevocation(await signedBytes(key, revocationPayload()), [trusted]);
    expect(verdict.ok).toBe(true);
    if (verdict.ok) expect(verdict.payload.revokedKeyId).toBe("root-2");
  });

  it("rejects untrusted signers and invalid payloads", async () => {
    const { key, trusted } = await makeRoot();
    const other = await importSigningKeyFromSeed(fromHex(INTERMEDIATE_SEED));
    const bytes = await signedBytes(key, revocationPayload());
    expect(await verifyRootRevocation(bytes, [{ keyId: "o", publicKey: other.publicKey }])).toEqual({
      ok: false,
      reason: "untrusted-signer",
    });

    for (const payload of [
      revocationPayload({ reason: "" }),
      revocationPayload({ revokedFrom: 1.5 }),
      revocationPayload({ note: "extra" }),
    ]) {
      expect(await verifyRootRevocation(await signedBytes(key, payload), [trusted])).toEqual({
        ok: false,
        reason: "invalid-payload",
      });
    }

    expect(
      await verifyRootRevocation(await signedBytes(key, revocationPayload({ signedBy: "root-9" })), [
        trusted,
      ]),
    ).toEqual({ ok: false, reason: "signer-mismatch" });
  });
});
