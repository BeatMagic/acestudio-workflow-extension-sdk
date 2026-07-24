// Shared helpers for the workspace build and validate scripts.
import { fileURLToPath } from "node:url";

const repoRoot = new URL("../", import.meta.url);

// Resolve a repo-root-relative path to an absolute filesystem path.
export const abs = (p) => fileURLToPath(new URL(p, repoRoot));

// The type-bearing library packages — the ones with a public API surface, and so
// the ones the surface gates (api-extractor, publint/attw, typedoc) apply to. The
// CLI and the scaffolder ship as bins with no public types.
export const LIBRARY_PACKAGES = ["packages/acestudio-bridge-core", "packages/acestudio-extension-sdk"];
