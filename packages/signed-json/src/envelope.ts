import { fromBase64, toBase64, utf8Decode } from "./bytes";
import { sign, verifySignature } from "./ed25519";

/**
 * The uniform container for every signed artifact on the wire (ADR 0089 §5).
 * `payload` is base64 of the exact signed bytes; verifiers check the signature
 * over those bytes and only then parse them — never re-serialize.
 */
export interface SignedEnvelope {
  payload: string;
  signature: string;
  /** Certificate statements linking the signing key to an embedded root. */
  chain?: SignedEnvelope[];
}

export type EnvelopeVerdict =
  | { ok: true; payloadBytes: Uint8Array }
  | { ok: false; reason: "malformed-envelope" | "bad-signature" };

export type JsonVerdict =
  | { ok: true; value: unknown; payloadBytes: Uint8Array }
  | { ok: false; reason: "malformed-envelope" | "bad-signature" | "invalid-json" };

export async function createSignedEnvelope(
  privateKey: CryptoKey,
  payloadBytes: Uint8Array,
  chain?: SignedEnvelope[],
): Promise<SignedEnvelope> {
  const signature = await sign(privateKey, payloadBytes);
  const envelope: SignedEnvelope = {
    payload: toBase64(payloadBytes),
    signature: toBase64(signature),
  };
  if (chain !== undefined) envelope.chain = chain;
  return envelope;
}

export async function verifyEnvelope(
  publicKey: Uint8Array,
  envelope: SignedEnvelope,
): Promise<EnvelopeVerdict> {
  let payloadBytes: Uint8Array;
  let signatureBytes: Uint8Array;
  try {
    payloadBytes = fromBase64(envelope.payload);
    signatureBytes = fromBase64(envelope.signature);
  } catch {
    return { ok: false, reason: "malformed-envelope" };
  }
  if (!(await verifySignature(publicKey, signatureBytes, payloadBytes))) {
    return { ok: false, reason: "bad-signature" };
  }
  return { ok: true, payloadBytes };
}

export async function verifyEnvelopeJson(
  publicKey: Uint8Array,
  envelope: SignedEnvelope,
): Promise<JsonVerdict> {
  const verdict = await verifyEnvelope(publicKey, envelope);
  if (!verdict.ok) return verdict;
  try {
    return {
      ok: true,
      value: JSON.parse(utf8Decode(verdict.payloadBytes)),
      payloadBytes: verdict.payloadBytes,
    };
  } catch {
    return { ok: false, reason: "invalid-json" };
  }
}

// As strict as the wire schemas: unknown keys rejected, and chains never nest
// (chain items are certificate envelopes, which carry no chain themselves).
function isEnvelopeShaped(value: unknown, allowChain: boolean): value is SignedEnvelope {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  const knownKeys = allowChain ? ["payload", "signature", "chain"] : ["payload", "signature"];
  if (Object.keys(candidate).some((key) => !knownKeys.includes(key))) return false;
  // Non-empty mirrors the wire schemas (base64 fields carry a minLength), so an
  // empty payload/signature is a malformed envelope, not a bad signature.
  if (typeof candidate.payload !== "string" || candidate.payload.length === 0) return false;
  if (typeof candidate.signature !== "string" || candidate.signature.length === 0) return false;
  if (allowChain && candidate.chain !== undefined) {
    if (!Array.isArray(candidate.chain)) return false;
    if (!candidate.chain.every((link) => isEnvelopeShaped(link, false))) return false;
  }
  return true;
}

/**
 * Minimal structural parse of an untrusted envelope container. The payload
 * inside stays opaque bytes until a signature over it has been verified.
 */
export function parseEnvelope(bytes: Uint8Array): SignedEnvelope | null {
  let value: unknown;
  try {
    value = JSON.parse(utf8Decode(bytes));
  } catch {
    return null;
  }
  return isEnvelopeShaped(value, true) ? value : null;
}
