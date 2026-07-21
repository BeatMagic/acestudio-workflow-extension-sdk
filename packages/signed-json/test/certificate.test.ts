import { describe, expect, it } from "vitest";
import {
  CERTIFICATE_FORMAT,
  createCertificate,
  fromHex,
  importSigningKeyFromSeed,
  parseCertificatePayload,
  toBase64,
  utf8Encode,
  verifyEnvelope,
} from "@timedomain/workflowext-signed-json";

const ROOT_SEED = fromHex("9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60");
const INTERMEDIATE_SEED = fromHex("4ccd089b28ff96da9db6c346ec114e0f5b8a319f35aba624da8cf6ed4fb8a6fb");

describe("certificate statement (ADR 0089 §5)", () => {
  it("root signs an intermediate certificate that verifies and parses", async () => {
    const root = await importSigningKeyFromSeed(ROOT_SEED);
    const intermediate = await importSigningKeyFromSeed(INTERMEDIATE_SEED);

    const certificate = await createCertificate(root.privateKey, {
      keyId: "intermediate-1",
      publicKey: intermediate.publicKey,
      role: "intermediate",
      validFrom: 1752710400,
      signedBy: "root-1",
    });

    const verdict = await verifyEnvelope(root.publicKey, certificate);
    expect(verdict.ok).toBe(true);
    if (!verdict.ok) return;

    const payload = parseCertificatePayload(verdict.payloadBytes);
    expect(payload).toEqual({
      format: CERTIFICATE_FORMAT,
      formatVersion: 1,
      keyId: "intermediate-1",
      publicKey: toBase64(intermediate.publicKey),
      role: "intermediate",
      validFrom: 1752710400,
      signedBy: "root-1",
    });
  });

  it("does not verify under a key other than the signer", async () => {
    const root = await importSigningKeyFromSeed(ROOT_SEED);
    const intermediate = await importSigningKeyFromSeed(INTERMEDIATE_SEED);

    const certificate = await createCertificate(root.privateKey, {
      keyId: "intermediate-1",
      publicKey: intermediate.publicKey,
      role: "intermediate",
      validFrom: 1752710400,
      signedBy: "root-1",
    });

    const verdict = await verifyEnvelope(intermediate.publicKey, certificate);
    expect(verdict).toEqual({ ok: false, reason: "bad-signature" });
  });
});

describe("parseCertificatePayload structural checks", () => {
  const valid = {
    format: CERTIFICATE_FORMAT,
    formatVersion: 1,
    keyId: "intermediate-1",
    // base64 of 32 bytes
    publicKey: toBase64(new Uint8Array(32)),
    role: "intermediate",
    validFrom: 1752710400,
    signedBy: "root-1",
  };

  function bytesOf(payload: unknown): Uint8Array {
    return utf8Encode(JSON.stringify(payload));
  }

  it("accepts a well-formed payload", () => {
    expect(parseCertificatePayload(bytesOf(valid))).toEqual(valid);
  });

  it.each([
    ["wrong format", { ...valid, format: "something.else" }],
    ["wrong formatVersion", { ...valid, formatVersion: 2 }],
    ["missing keyId", { ...valid, keyId: undefined }],
    ["empty keyId", { ...valid, keyId: "" }],
    ["keyId with disallowed characters", { ...valid, keyId: "Intermediate_1" }],
    ["keyId with a leading hyphen", { ...valid, keyId: "-intermediate" }],
    ["unknown role", { ...valid, role: "leaf" }],
    ["non-integer validFrom", { ...valid, validFrom: 1.5 }],
    ["negative validFrom", { ...valid, validFrom: -1 }],
    ["publicKey not base64", { ...valid, publicKey: "@@" }],
    ["publicKey wrong length", { ...valid, publicKey: toBase64(new Uint8Array(31)) }],
    ["missing signedBy", { ...valid, signedBy: undefined }],
    ["signedBy with disallowed characters", { ...valid, signedBy: "ROOT-1" }],
    ["extra property (closed contract)", { ...valid, nickname: "spare key" }],
  ])("rejects %s", (_name, payload) => {
    expect(parseCertificatePayload(bytesOf(payload))).toBeNull();
  });

  it("rejects non-JSON bytes", () => {
    expect(parseCertificatePayload(utf8Encode("not json"))).toBeNull();
  });
});
