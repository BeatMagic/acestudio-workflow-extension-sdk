import {
  createCertificate,
  createSignedEnvelope,
  fromHex,
  importSigningKeyFromSeed,
  sha256Hex,
  toBase64,
  utf8Encode,
  type SigningKey,
} from "@timedomain/workflowext-signed-json";
import { SIGNATURE_BLOCK_FORMAT, type SignatureBlockPayload } from "@timedomain/workflowext-wire-schemas";
import type { TrustedRoot } from "@timedomain/workflowext-verifier";
import type { ZipFile } from "../src/bundle/zip";

// Throwaway RFC 8032 test seeds — no shipped client ever trusts these.
const ROOT_SEED = "9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60";
const INTERMEDIATE_SEED = "4ccd089b28ff96da9db6c346ec114e0f5b8a319f35aba624da8cf6ed4fb8a6fb";
const CERT_VALID_FROM = 1752000000;
export const FIXTURE_SIGNED_AT = 1752710400;

export interface TestSigner {
  root: SigningKey;
  intermediate: SigningKey;
  intermediateCertificate: Awaited<ReturnType<typeof createCertificate>>;
}

export async function makeTestSigner(): Promise<TestSigner> {
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

export function rootsOf(signer: TestSigner): TrustedRoot[] {
  return [{ keyId: "root-1", publicKey: signer.root.publicKey }];
}

/**
 * Signs a set of unsigned bundle files exactly the way the service does:
 * hash every file, sort the map, sign the payload with the intermediate, and
 * append `_signature/block.json`. Returns the full signed file set.
 */
export async function signFiles(
  signer: TestSigner,
  files: readonly ZipFile[],
  identity: { extensionId: string; developerId: string; version: string },
): Promise<ZipFile[]> {
  const fileMap: Record<string, string> = {};
  for (const file of files) fileMap[file.path] = await sha256Hex(file.bytes);
  const sorted: Record<string, string> = {};
  for (const path of Object.keys(fileMap).sort()) sorted[path] = fileMap[path]!;

  const payload: SignatureBlockPayload = {
    format: SIGNATURE_BLOCK_FORMAT,
    formatVersion: 1,
    extensionId: identity.extensionId,
    developerId: identity.developerId,
    version: identity.version,
    signedAt: FIXTURE_SIGNED_AT,
    files: sorted,
  };
  const envelope = await createSignedEnvelope(signer.intermediate.privateKey, utf8Encode(JSON.stringify(payload)), [
    signer.intermediateCertificate,
  ]);
  return [...files, { path: "_signature/block.json", bytes: utf8Encode(JSON.stringify(envelope)) }];
}

export function rootsFileContent(signer: TestSigner): string {
  return JSON.stringify([{ keyId: "root-1", publicKey: toBase64(signer.root.publicKey) }]);
}
