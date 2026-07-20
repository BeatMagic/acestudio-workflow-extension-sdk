export function utf8Encode(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

export function utf8Decode(bytes: Uint8Array): string {
  return new TextDecoder("utf-8", { fatal: true, ignoreBOM: false }).decode(bytes);
}

// Wire encoding is standard-alphabet base64 with padding (the schemas pin it).
const BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

export function toBase64(bytes: Uint8Array): string {
  // Build the binary string in chunks: per-byte `+=` is O(n^2) in most
  // engines, and spreading the whole array into fromCharCode overflows the
  // call stack on large inputs. 0x8000 stays isomorphic (Node/Workers).
  let binary = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

export function fromBase64(text: string): Uint8Array {
  if (!BASE64_PATTERN.test(text)) {
    throw new Error("malformed base64");
  }
  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function toHex(bytes: Uint8Array): string {
  let hex = "";
  for (const byte of bytes) hex += byte.toString(16).padStart(2, "0");
  return hex;
}

export function fromHex(text: string): Uint8Array {
  if (text.length % 2 !== 0 || !/^[0-9a-f]*$/.test(text)) {
    throw new Error("malformed lowercase hex");
  }
  const bytes = new Uint8Array(text.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(text.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export function concatBytes(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}
