export { run, type RunDeps } from "./app";
export { ExitCode, exitForServiceCode } from "./exit-codes";
export { PRODUCTION_SERVICE, resolveService, type ResolvedService } from "./service";
export { deriveBundleName, packDir, PackError } from "./bundle/pack";
export { readZip, writeZip, ZipError, type ZipFile } from "./bundle/zip";
export { verifyBundleBytes, type VerifyResult } from "./verify/verify";
export { defaultRoots, loadRoots, parseRoots, RootsError } from "./verify/roots";
export {
  mintAdhocIdentity,
  submitBundle,
  type ServiceError,
  type SignedResult,
} from "./submit/client";
export { classifyCredential, type CredentialKind } from "./credentials/classify";
export {
  appDataDir,
  FileCredentialStore,
  type CredentialStore,
} from "./credentials/store";
export {
  defaultCredentialStore,
  KeychainCredentialStore,
  KeychainOrFileStore,
  keychainAvailable,
  napiKeyring,
  type KeyringPort,
} from "./credentials/keychain";
export { resolveCredential, TOKEN_ENV_VAR, type ResolvedCredential } from "./credentials/resolve";
export { configPath, loadServiceAliases } from "./config";
