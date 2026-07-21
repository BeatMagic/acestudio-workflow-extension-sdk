import {
  createCertificate,
  createSignedEnvelope,
  fromHex,
  importSigningKeyFromSeed,
  sha256Hex,
  utf8Encode,
  type SignedEnvelope,
  type SigningKey,
} from "@timedomain/workflowext-signed-json";
import { SIGNATURE_BLOCK_FORMAT, type SignatureBlockPayload } from "@timedomain/workflowext-wire-schemas";

// Throwaway test seeds (RFC 8032 vectors) — no shipped client ever trusts these.
export const ROOT_SEED = "9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60";
export const INTERMEDIATE_SEED = "4ccd089b28ff96da9db6c346ec114e0f5b8a319f35aba624da8cf6ed4fb8a6fb";

export interface BundleFile {
  path: string;
  bytes: Uint8Array;
}

export interface TestKeys {
  root: SigningKey;
  intermediate: SigningKey;
  intermediateCertificate: SignedEnvelope;
}

export const CERT_VALID_FROM = 1752000000;
export const SIGNED_AT = 1752710400;

export async function makeTestKeys(): Promise<TestKeys> {
  const root = await importSigningKeyFromSeed(fromHex(ROOT_SEED));
  const intermediate = await importSigningKeyFromSeed(fromHex(INTERMEDIATE_SEED));
  const intermediateCertificate = await createCertificate(root.privateKey, {
    keyId: "intermediate-1",
    publicKey: intermediate.publicKey,
    role: "intermediate",
    validFrom: CERT_VALID_FROM,
    signedBy: "root-1",
  });
  return { root, intermediate, intermediateCertificate };
}

/**
 * Builds a signed bundle the way the service will: hash every file, sign the
 * exact payload bytes with the intermediate, insert _signature/block.json.
 */
export async function buildSignedBundle(
  keys: TestKeys,
  files: BundleFile[],
  overrides: Partial<SignatureBlockPayload> = {},
): Promise<BundleFile[]> {
  const fileHashes: Record<string, string> = {};
  for (const file of files) {
    fileHashes[file.path] = await sha256Hex(file.bytes);
  }
  const payload: SignatureBlockPayload = {
    format: SIGNATURE_BLOCK_FORMAT,
    formatVersion: 1,
    extensionId: "acestudio.mv-runtime",
    developerId: "acestudio",
    version: "1.2.3",
    signedAt: SIGNED_AT,
    files: fileHashes,
    ...overrides,
  };
  const block = await createSignedEnvelope(
    keys.intermediate.privateKey,
    utf8Encode(JSON.stringify(payload)),
    [keys.intermediateCertificate],
  );
  return [
    ...files,
    { path: "_signature/block.json", bytes: utf8Encode(JSON.stringify(block)) },
  ];
}
