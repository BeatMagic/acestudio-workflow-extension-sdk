import { describe, expect, it } from "vitest";
import {
  fromBase64,
  fromHex,
  importSigningKeyFromSeed,
  sha256Hex,
  sign,
  toBase64,
  toHex,
  utf8Encode,
  verifySignature,
} from "@beatmagic/workflowext-signed-json";

describe("byte encodings", () => {
  it("round-trips standard padded base64", () => {
    expect(toBase64(utf8Encode("hello"))).toBe("aGVsbG8=");
    expect(fromBase64("aGVsbG8=")).toEqual(utf8Encode("hello"));
  });

  it("rejects malformed base64 instead of decoding garbage", () => {
    expect(() => fromBase64("not base64!!")).toThrow();
  });

  it("encodes lowercase hex", () => {
    expect(toHex(new Uint8Array([0xde, 0xad, 0xbe, 0xef]))).toBe("deadbeef");
    expect(fromHex("deadbeef")).toEqual(new Uint8Array([0xde, 0xad, 0xbe, 0xef]));
  });

  it("rejects odd-length or non-hex input", () => {
    expect(() => fromHex("abc")).toThrow();
    expect(() => fromHex("zz")).toThrow();
  });
});

describe("sha256Hex", () => {
  it("matches the NIST 'abc' vector", async () => {
    await expect(sha256Hex(utf8Encode("abc"))).resolves.toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });
});

// RFC 8032 §7.1 — independent source of truth for the Ed25519 wrapper.
describe("Ed25519 over exact bytes", () => {
  const test1 = {
    seed: "9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60",
    publicKey: "d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a",
    message: new Uint8Array(0),
    signature:
      "e5564300c360ac729086e2cc806e828a84877f1eb8e5d974d873e065224901555fb8821590a33bacc61e39701cf9b46bd25bf5f0595bbe24655141438e7a100b",
  };
  const test2 = {
    seed: "4ccd089b28ff96da9db6c346ec114e0f5b8a319f35aba624da8cf6ed4fb8a6fb",
    publicKey: "3d4017c3e843895a92b70aa74d1b7ebc9c982ccf2ec4968cc0cd55f12af4660c",
    message: new Uint8Array([0x72]),
    signature:
      "92a009a9f0d4cab8720e820b5f642540a2b27b5416503f8fb3762223ebdb69da085ac1e43e15996e458f3613d0f11d8c387b2eaeb4302aeeb00d291612bb0c00",
  };

  for (const [name, vector] of [
    ["RFC 8032 TEST 1 (empty message)", test1],
    ["RFC 8032 TEST 2 (one byte)", test2],
  ] as const) {
    it(`derives the public key and signature of ${name}`, async () => {
      const key = await importSigningKeyFromSeed(fromHex(vector.seed));
      expect(toHex(key.publicKey)).toBe(vector.publicKey);

      const signature = await sign(key.privateKey, vector.message);
      expect(toHex(signature)).toBe(vector.signature);

      await expect(
        verifySignature(key.publicKey, signature, vector.message),
      ).resolves.toBe(true);
    });
  }

  it("rejects a signature over different bytes", async () => {
    const key = await importSigningKeyFromSeed(fromHex(test2.seed));
    await expect(
      verifySignature(key.publicKey, fromHex(test2.signature), utf8Encode("tampered")),
    ).resolves.toBe(false);
  });

  it("rejects a signature from a different key", async () => {
    const key1 = await importSigningKeyFromSeed(fromHex(test1.seed));
    await expect(
      verifySignature(key1.publicKey, fromHex(test2.signature), test2.message),
    ).resolves.toBe(false);
  });
});
