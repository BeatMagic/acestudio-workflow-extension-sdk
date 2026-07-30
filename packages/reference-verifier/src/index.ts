export { resolveChain, type ChainResolution } from "./chain";
export {
  isRevocationEntry,
  parseRevocationListPayload,
  parseTrustRegistryPayload,
  verifyRevocationList,
  verifyTrustRegistry,
  type ChainedTrustFileRejectReason,
  type RevocationListVerdict,
  type TrustRegistryVerdict,
} from "./chained-trust-files";
export {
  checkCoverage,
  digestFiles,
  SIGNATURE_BLOCK_PATH,
  type ArchiveFile,
  type CoverageVerdict,
} from "./coverage";
export {
  isValidArchivePath,
  isValidDeveloperSlug,
  isValidExtensionId,
  isValidSemver,
  parseSignatureBlockPayload,
} from "./payload";
export { compareSemver, findRevocationMatches, type RevocationQuery } from "./revocation-match";
export {
  KEY_ID_PATTERN,
  verifyKeyDirectory,
  verifyRootRevocation,
  type KeyDirectoryVerdict,
  type RootRevocationVerdict,
  type TrustFileRejectReason,
} from "./trust-files";
export type { BundleVerdict, RejectReason, TrustedRoot } from "./verdict";
export { verifySignedBundle } from "./verifier";
