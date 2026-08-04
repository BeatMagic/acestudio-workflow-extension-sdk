// Builds every workspace package to dist/. esbuild bundles the JS — resolving the
// extensionless relative imports Node's ESM loader rejects, and inlining the
// shared contract code the CLI needs to run standalone — and tsc emits the .d.ts
// for every package with a public type surface. Same esbuild approach as the
// signing-service repo's ceremony bundle.
//
// Bundling only settles the JS. A .d.ts is emitted per source file with its specifiers
// copied through verbatim, so anything a declaration points at has to resolve from where
// that declaration lands in the tarball, which is why the libraries write `./x.js` in
// full, and why the schemas are staged under dist/ below.
//
// This is also the prepack hook, so it owes the tarball every file the manifest promises:
// hence the license, which lives once at the repo root and is staged into each package.
import { execFileSync } from "node:child_process";
import { cp, rm } from "node:fs/promises";
import { build } from "esbuild";
import { abs, PUBLISHED_PACKAGES } from "./_lib.mjs";

// The contract packages layer on each other; a library keeps its peers external
// so consumers share one copy (and one class identity) rather than inlined dupes.
const CONTRACT_PACKAGES = [
  "@timedomain/workflowext-signed-json",
  "@timedomain/workflowext-wire-schemas",
  "@timedomain/workflowext-verifier",
];

const PACKAGES = [
  { dir: "packages/signed-json", entries: ["src/index.ts"], external: CONTRACT_PACKAGES, types: true },
  // The schemas are staged into dist/ so one copy serves both readers: the emitted
  // declarations, which point at `../schemas/…` from dist/src/, and the `./schemas/*`
  // export a consumer reads the raw JSON through. esbuild inlines them into the bundle
  // as well; that is the JS path, and neither of those two is the JS path.
  {
    dir: "packages/wire-schemas",
    entries: ["src/index.ts"],
    assets: ["schemas"],
    external: CONTRACT_PACKAGES,
    types: true,
  },
  { dir: "packages/reference-verifier", entries: ["src/index.ts"], external: CONTRACT_PACKAGES, types: true },
  // The CLI inlines the contract packages so its bin runs from a packed tarball with
  // only its declared dependencies installed. It ships as a binary — no .d.ts.
  //
  // The scaffolder `init` calls is the exception that must stay external. It reads its
  // templates off disk relative to its own module (`import.meta.url`), so inlining it
  // here would send that lookup into packages/cli/dist/, where no templates live — a
  // break that only the shipped artifact shows, since in-repo the same code resolves
  // to the scaffolder's own source. scripts/smoke-scaffold.mjs is what catches it.
  {
    dir: "packages/cli",
    entries: ["src/index.ts", "src/cli.ts"],
    external: ["@napi-rs/keyring", "@timedomain/create-acestudio-workflow-extension"],
    types: false,
  },

  // The extension SDK packages. bridge-core is the connection layer; the
  // extension SDK sits above it, and keeps it external so consumers share one
  // copy — and one BridgeError class identity. The extension SDK's page side ships
  // from the ./page subpath, bundled for the browser: `platform: "browser"` is what
  // turns a stray Node built-in in that import graph into a build failure rather
  // than something a webview discovers at run time. The scaffolder ships as a bin —
  // no .d.ts.
  { dir: "packages/acestudio-bridge-core", entries: ["src/index.ts"], external: [], types: true },
  {
    dir: "packages/acestudio-workflow-extension-sdk",
    entries: ["src/index.ts"],
    browserEntries: ["src/page/index.ts"],
    external: ["@timedomain/acestudio-bridge-core"],
    types: true,
  },
  { dir: "packages/create-acestudio-workflow-extension", entries: ["src/index.ts", "src/cli.ts"], external: [], types: false },
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
      // Resolve @timedomain peers to their source, the same condition tsc
      // (customConditions) and vitest (ssr.resolve.conditions) use.
      conditions: ["acestudio:source"],
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
  for (const asset of pkg.assets ?? []) {
    await cp(abs(`${pkg.dir}/${asset}`), abs(`${pkg.dir}/dist/${asset}`), { recursive: true });
  }
  if (pkg.types) {
    // Run tsc via `node <tsc entry>` rather than the .bin shim, so the build
    // works on Windows too (where the shim is tsc.cmd, not an execFile target).
    execFileSync(process.execPath, [abs("node_modules/typescript/bin/tsc"), "-p", abs(`${pkg.dir}/tsconfig.build.json`)], {
      stdio: "inherit",
    });
  }
}

// The terms are the repo's, so the file is the repo's: one copy, at the root, staged into
// each package rather than committed seven times. Derived from the same list the publish
// workflow stages, so a package cannot become publishable without being covered here.
//
// npm drops a `files` entry that does not exist without complaining, so the manifest naming
// it is not what guarantees it is there; this loop running before pack is. That is why the
// staging belongs in the prepack hook rather than in a release step someone has to remember.
for (const dir of PUBLISHED_PACKAGES) {
  await cp(abs("LICENSE"), abs(`${dir}/LICENSE`));
}
