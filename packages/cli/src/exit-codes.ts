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
  "rate-limited": ExitCode.RateLimited,
  "bundle-too-large": ExitCode.BundleTooLarge,
  "manifest-invalid": ExitCode.ManifestInvalid,
  "invalid-extension-id": ExitCode.ManifestInvalid,
  "reverse-domain-id": ExitCode.ManifestInvalid,
  "invalid-version": ExitCode.ManifestInvalid,
  "invalid-display-name": ExitCode.ManifestInvalid,
};

export function exitForServiceCode(code: string): ExitCode {
  return SERVICE_CODE_EXITS[code] ?? ExitCode.Generic;
}
