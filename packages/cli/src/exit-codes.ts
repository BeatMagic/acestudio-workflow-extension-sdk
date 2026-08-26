/**
 * Stable process exit codes for the CLI. Success and usage follow the usual
 * convention; the middle band maps the submission API's own `code` values so
 * a script can branch on *why* a submission was refused without parsing text.
 * Anything unmapped collapses to Generic — the precise `code` is still there
 * in `--json` output.
 */
export const ExitCode = {
  Success: 0,
  Generic: 1,
  Usage: 2,
  MissingCredential: 3,
  IdentityRefused: 4,
  RateLimited: 5,
  BundleTooLarge: 6,
  ManifestInvalid: 7,
  VerifyFailed: 8,
} as const;

export type ExitCode = (typeof ExitCode)[keyof typeof ExitCode];

const SERVICE_CODE_EXITS: Readonly<Record<string, ExitCode>> = {
  "missing-credential": ExitCode.MissingCredential,
  "unknown-credential": ExitCode.MissingCredential,
  "token-expired": ExitCode.MissingCredential,
  "token-revoked": ExitCode.MissingCredential,
  "identity-refused": ExitCode.IdentityRefused,
  // Every other way the service says "that identity is not yours to sign
  // under": a bundle outside the credential's namespace, a slug held for the
  // Official tier, one already owned by a registered developer, a privileged
  // manifest below Official, and an update carrying the wrong predecessor.
  // They join the anti-impersonation refusal because that is the distinction a
  // script branching on the exit code needs — an identity problem, not a bad
  // bundle and not a transport failure.
  "namespace-violation": ExitCode.IdentityRefused,
  "reserved-slug": ExitCode.IdentityRefused,
  "elevated-tier-conflict": ExitCode.IdentityRefused,
  "privilege-not-official": ExitCode.IdentityRefused,
  "update-continuity": ExitCode.IdentityRefused,
  "rate-limited": ExitCode.RateLimited,
  "bundle-too-large": ExitCode.BundleTooLarge,
  "manifest-invalid": ExitCode.ManifestInvalid,
  "invalid-extension-id": ExitCode.ManifestInvalid,
  "reverse-domain-id": ExitCode.ManifestInvalid,
  "invalid-version": ExitCode.ManifestInvalid,
  "invalid-display-name": ExitCode.ManifestInvalid,
  // The service refused the shape of the chosen developer id. A slug only
  // reaches the wire past the same local check, so seeing this means the two
  // rules have drifted — but it is still an id-validation failure.
  "bad-slug": ExitCode.ManifestInvalid,
};

export function exitForServiceCode(code: string): ExitCode {
  return SERVICE_CODE_EXITS[code] ?? ExitCode.Generic;
}
