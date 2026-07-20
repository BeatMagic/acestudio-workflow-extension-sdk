import { describe, expect, it } from "vitest";
import {
  createSignedEnvelope,
  fromHex,
  importSigningKeyFromSeed,
  parseEnvelope,
  toBase64,
  utf8Encode,
  verifyEnvelope,
  verifyEnvelopeJson,
} from "@beatmagic/workflowext-signed-json";

const SEED_A = fromHex("9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60");
const SEED_B = fromHex("4ccd089b28ff96da9db6c346ec114e0f5b8a319f35aba624da8cf6ed4fb8a6fb");

describe("signed envelope", () => {
  const payloadBytes = utf8Encode('{"hello":1}');

  it("round-trips: signed payload bytes verify exactly", async () => {
    const key = await importSigningKeyFromSeed(SEED_A);
    const envelope = await createSignedEnvelope(key.privateKey, payloadBytes);

    const verdict = await verifyEnvelope(key.publicKey, envelope);
    expect(verdict).toEqual({ ok: true, payloadBytes });
  });

  it("rejects a tampered payload as bad-signature", async () => {
    const key = await importSigningKeyFromSeed(SEED_A);
    const envelope = await createSignedEnvelope(key.privateKey, payloadBytes);
    const tampered = { ...envelope, payload: toBase64(utf8Encode('{"hello":2}')) };

    const verdict = await verifyEnvelope(key.publicKey, tampered);
    expect(verdict).toEqual({ ok: false, reason: "bad-signature" });
  });

  it("rejects a signature from the wrong key", async () => {
    const keyA = await importSigningKeyFromSeed(SEED_A);
    const keyB = await importSigningKeyFromSeed(SEED_B);
    const envelope = await createSignedEnvelope(keyA.privateKey, payloadBytes);

    const verdict = await verifyEnvelope(keyB.publicKey, envelope);
    expect(verdict).toEqual({ ok: false, reason: "bad-signature" });
  });

  it("rejects malformed base64 fields as malformed-envelope, not an exception", async () => {
    const key = await importSigningKeyFromSeed(SEED_A);
    const envelope = await createSignedEnvelope(key.privateKey, payloadBytes);

    await expect(
      verifyEnvelope(key.publicKey, { ...envelope, payload: "@@not-base64@@" }),
    ).resolves.toEqual({ ok: false, reason: "malformed-envelope" });
    await expect(
      verifyEnvelope(key.publicKey, { ...envelope, signature: "@@not-base64@@" }),
    ).resolves.toEqual({ ok: false, reason: "malformed-envelope" });
  });

  it("carries an optional cert chain through creation", async () => {
    const key = await importSigningKeyFromSeed(SEED_A);
    const cert = await createSignedEnvelope(key.privateKey, utf8Encode('{"cert":true}'));
    const envelope = await createSignedEnvelope(key.privateKey, payloadBytes, [cert]);

    expect(envelope.chain).toEqual([cert]);
  });
});

describe("verifyEnvelopeJson (verify-before-parse)", () => {
  it("returns the parsed value only for a verified payload", async () => {
    const key = await importSigningKeyFromSeed(SEED_A);
    const envelope = await createSignedEnvelope(key.privateKey, utf8Encode('{"n":42}'));

    const verdict = await verifyEnvelopeJson(key.publicKey, envelope);
    expect(verdict.ok).toBe(true);
    if (verdict.ok) expect(verdict.value).toEqual({ n: 42 });
  });

  it("reports invalid-json for a correctly signed non-JSON payload", async () => {
    const key = await importSigningKeyFromSeed(SEED_A);
    const envelope = await createSignedEnvelope(key.privateKey, utf8Encode("not json"));

    await expect(verifyEnvelopeJson(key.publicKey, envelope)).resolves.toEqual({
      ok: false,
      reason: "invalid-json",
    });
  });

  it("reports bad-signature for unverified payloads even when they are not JSON", async () => {
    const keyA = await importSigningKeyFromSeed(SEED_A);
    const keyB = await importSigningKeyFromSeed(SEED_B);
    const envelope = await createSignedEnvelope(keyA.privateKey, utf8Encode("not json"));

    await expect(verifyEnvelopeJson(keyB.publicKey, envelope)).resolves.toEqual({
      ok: false,
      reason: "bad-signature",
    });
  });
});

describe("parseEnvelope", () => {
  it("parses well-formed envelope bytes", async () => {
    const key = await importSigningKeyFromSeed(SEED_A);
    const envelope = await createSignedEnvelope(key.privateKey, utf8Encode('{"n":1}'));
    const bytes = utf8Encode(JSON.stringify(envelope));

    expect(parseEnvelope(bytes)).toEqual(envelope);
  });

  it("returns null for garbage, missing fields, or wrong types", () => {
    expect(parseEnvelope(utf8Encode("not json"))).toBeNull();
    expect(parseEnvelope(utf8Encode('{"payload":"aGk="}'))).toBeNull();
    expect(parseEnvelope(utf8Encode('{"payload":1,"signature":"aGk="}'))).toBeNull();
    expect(parseEnvelope(utf8Encode('{"payload":"aGk=","signature":"aGk=","chain":"no"}'))).toBeNull();
  });

  it("rejects empty payload or signature strings (schema minLength)", () => {
    expect(parseEnvelope(utf8Encode('{"payload":"","signature":"aGk="}'))).toBeNull();
    expect(parseEnvelope(utf8Encode('{"payload":"aGk=","signature":""}'))).toBeNull();
  });

  it("is as strict as the wire schemas: no unknown keys, no nested chains", () => {
    expect(
      parseEnvelope(utf8Encode('{"payload":"aGk=","signature":"aGk=","extra":1}')),
    ).toBeNull();
    expect(
      parseEnvelope(
        utf8Encode(
          '{"payload":"aGk=","signature":"aGk=","chain":[{"payload":"aGk=","signature":"aGk=","chain":[]}]}',
        ),
      ),
    ).toBeNull();
  });
});
