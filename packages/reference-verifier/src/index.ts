export { resolveChain, type ChainResolution } from "./chain.js";
export {
  isRevocationEntry,
  parseRevocationListPayload,
  parseTrustRegistryPayload,
  verifyRevocationList,
  verifyTrustRegistry,
  type ChainedTrustFileRejectReason,
  type RevocationListVerdict,
  type TrustRegistryVerdict,
} from "./chained-trust-files.js";
export {
  checkCoverage,
  digestFiles,
  SIGNATURE_BLOCK_PATH,
  type ArchiveFile,
  type CoverageVerdict,
} from "./coverage.js";
export {
  isValidArchivePath,
  isValidDeveloperSlug,
  isValidExtensionId,
  isValidSemver,
  parseSignatureBlockPayload,
} from "./payload.js";
export { compareSemver, findRevocationMatches, type RevocationQuery } from "./revocation-match.js";
export {
  KEY_ID_PATTERN,
  verifyKeyDirectory,
  verifyRootRevocation,
  type KeyDirectoryVerdict,
  type RootRevocationVerdict,
  type TrustFileRejectReason,
} from "./trust-files.js";
export type { BundleVerdict, RejectReason, TrustedRoot } from "./verdict.js";
export { verifySignedBundle } from "./verifier.js";
