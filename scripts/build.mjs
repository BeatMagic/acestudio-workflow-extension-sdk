// Builds every workspace package to dist/. esbuild bundles the JS — resolving the
// extensionless relative imports Node's ESM loader rejects, and inlining the
// shared contract code the CLI needs to run standalone — and tsc emits the .d.ts
// for every package with a public type surface. Same esbuild approach as the
// signing-service repo's ceremony bundle.
import { execFileSync } from "node:child_process";
import { rm } from "node:fs/promises";
import { build } from "esbuild";
import { abs } from "./_lib.mjs";

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

  // The extension SDK packages. bridge-core is the connection layer; the
  // extension SDK sits above it, and keeps it external so consumers share one
  // copy — and one BridgeError class identity. The extension SDK's page side ships
  // from the ./page subpath, bundled for the browser: `platform: "browser"` is what
  // turns a stray Node built-in in that import graph into a build failure rather
  // than something a webview discovers at run time. The scaffolder ships as a bin —
  // no .d.ts.
  { dir: "packages/acestudio-bridge-core", entries: ["src/index.ts"], external: [], types: true },
  {
    dir: "packages/acestudio-extension-sdk",
    entries: ["src/index.ts"],
    browserEntries: ["src/page/index.ts"],
    external: ["@timedomain/acestudio-bridge-core"],
    types: true,
  },
  { dir: "packages/create-acestudio-extension", entries: ["src/index.ts", "src/cli.ts"], external: [], types: false },
];

for (const pkg of PACKAGES) {
  const outdir = abs(`${pkg.dir}/dist`);
  await rm(outdir, { recursive: true, force: true });
  // `outbase` is pinned to src/ so each slice lands where the package's exports map
  // says, rather than at whatever the entries of that one slice have in common.
  const bundle = (entries, platform, target) =>
    build({
      entryPoints: entries.map((entry) => abs(`${pkg.dir}/${entry}`)),
      outdir,
      outbase: abs(`${pkg.dir}/src`),
      bundle: true,
      platform,
      format: "esm",
      target,
      // Resolve @timedomain peers to their source (the packages' dev entry), the
      // same as tsc's customConditions and vitest's alias.
      conditions: ["development"],
      external: pkg.external,
      logLevel: "info",
    });

  await bundle(pkg.entries, "node", "node24");
  if (pkg.browserEntries) {
    // No Node target here: the page side runs in ACE Studio's webview and in whatever
    // browser a developer opens it in, so it is built against the browsers, not an
    // engine version the SDK has no business naming.
    await bundle(pkg.browserEntries, "browser", "es2023");
  }
  if (pkg.types) {
    // Run tsc via `node <tsc entry>` rather than the .bin shim, so the build
    // works on Windows too (where the shim is tsc.cmd, not an execFile target).
    execFileSync(process.execPath, [abs("node_modules/typescript/bin/tsc"), "-p", abs(`${pkg.dir}/tsconfig.build.json`)], {
      stdio: "inherit",
    });
  }
}
