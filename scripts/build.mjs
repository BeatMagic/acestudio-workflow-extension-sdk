// Builds every workspace package to dist/. esbuild bundles the JS — resolving the
// extensionless relative imports Node's ESM loader rejects, and inlining the
// shared contract code the CLI needs to run standalone — and tsc emits the .d.ts
// for the three contract libraries. Same esbuild approach as the signing-service
// repo's ceremony bundle.
import { execFileSync } from "node:child_process";
import { rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const repoRoot = new URL("../", import.meta.url);
const abs = (p) => fileURLToPath(new URL(p, repoRoot));

// The contract packages layer on each other; a library keeps its peers external
// so consumers share one copy (and one class identity) rather than inlined dupes.
const CONTRACT_PACKAGES = [
  "@timedomain/workflowext-signed-json",
  "@timedomain/workflowext-wire-schemas",
  "@timedomain/workflowext-verifier",
];

const PACKAGES = [
  { dir: "packages/signed-json", entries: ["src/index.ts"], external: CONTRACT_PACKAGES, types: true },
  { dir: "packages/wire-schemas", entries: ["src/index.ts"], external: CONTRACT_PACKAGES, types: true },
  { dir: "packages/reference-verifier", entries: ["src/index.ts"], external: CONTRACT_PACKAGES, types: true },
  // The CLI inlines the contract packages so its bin runs from a packed tarball
  // with only the one native dependency installed. It ships as a binary — no .d.ts.
  { dir: "packages/cli", entries: ["src/index.ts", "src/cli.ts"], external: ["@napi-rs/keyring"], types: false },
];

for (const pkg of PACKAGES) {
  const outdir = abs(`${pkg.dir}/dist`);
  await rm(outdir, { recursive: true, force: true });
  await build({
    entryPoints: pkg.entries.map((entry) => abs(`${pkg.dir}/${entry}`)),
    outdir,
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node20",
    // Resolve @timedomain peers to their source (the packages' dev entry), the
    // same as tsc's customConditions and vitest's alias.
    conditions: ["development"],
    external: pkg.external,
    logLevel: "info",
  });
  if (pkg.types) {
    execFileSync(abs("node_modules/.bin/tsc"), ["-p", abs(`${pkg.dir}/tsconfig.build.json`)], {
      stdio: "inherit",
    });
  }
}
