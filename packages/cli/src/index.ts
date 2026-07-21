export { run, type RunDeps } from "./app";
export { ExitCode, exitForServiceCode } from "./exit-codes";
export { PRODUCTION_SERVICE, resolveService, type ResolvedService } from "./service";
export { deriveBundleName, packDir, PackError } from "./bundle/pack";
export { readZip, writeZip, ZipError, type ZipFile } from "./bundle/zip";
export { verifyBundleBytes, type VerifyResult } from "./verify/verify";
export { loadRoots, RootsError, DEFAULT_ROOTS_PATH } from "./verify/roots";
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
export { resolveCredential, TOKEN_ENV_VAR, type ResolvedCredential } from "./credentials/resolve";
