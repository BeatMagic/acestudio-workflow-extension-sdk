import { toHex } from "./bytes.js";

// Per-file hashes on the wire are lowercase-hex SHA-256 (the schemas pin it).
export async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes as BufferSource);
  return toHex(new Uint8Array(digest));
}
