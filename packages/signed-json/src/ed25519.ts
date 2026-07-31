import { concatBytes, fromBase64, fromHex } from "./bytes.js";

export interface SigningKey {
  privateKey: CryptoKey;
  /** Raw 32-byte Ed25519 public key. */
  publicKey: Uint8Array;
}

// PKCS#8 wrapper for a raw Ed25519 seed (RFC 8410): fixed 16-byte prefix + seed.
const PKCS8_ED25519_PREFIX = fromHex("302e020100300506032b657004220420");

function base64UrlToBytes(text: string): Uint8Array {
  const standard = text.replace(/-/g, "+").replace(/_/g, "/");
  return fromBase64(standard + "=".repeat((4 - (standard.length % 4)) % 4));
}

export async function generateSigningKey(): Promise<SigningKey> {
  const pair = (await crypto.subtle.generateKey("Ed25519", true, [
    "sign",
    "verify",
  ])) as CryptoKeyPair;
  const raw = (await crypto.subtle.exportKey("raw", pair.publicKey)) as ArrayBuffer;
  return { privateKey: pair.privateKey, publicKey: new Uint8Array(raw) };
}

export async function importSigningKeyFromSeed(seed: Uint8Array): Promise<SigningKey> {
  if (seed.length !== 32) {
    throw new Error(`Ed25519 seed must be 32 bytes, got ${seed.length}`);
  }
  const pkcs8 = concatBytes(PKCS8_ED25519_PREFIX, seed);
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    pkcs8 as BufferSource,
    "Ed25519",
    true,
    ["sign"],
  );
  const jwk = (await crypto.subtle.exportKey("jwk", privateKey)) as JsonWebKey;
  if (jwk.x === undefined) {
    throw new Error("Ed25519 private key export did not include the public half");
  }
  return { privateKey, publicKey: base64UrlToBytes(jwk.x) };
}

export async function sign(privateKey: CryptoKey, bytes: Uint8Array): Promise<Uint8Array> {
  const signature = await crypto.subtle.sign("Ed25519", privateKey, bytes as BufferSource);
  return new Uint8Array(signature);
}

/**
 * Verdict-shaped by design: malformed keys or signatures are "not verified",
 * never exceptions — verifiers run this on attacker-supplied input.
 */
export async function verifySignature(
  publicKey: Uint8Array,
  signature: Uint8Array,
  bytes: Uint8Array,
): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      publicKey as BufferSource,
      "Ed25519",
      false,
      ["verify"],
    );
    return await crypto.subtle.verify(
      "Ed25519",
      key,
      signature as BufferSource,
      bytes as BufferSource,
    );
  } catch {
    return false;
  }
}
