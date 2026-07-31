// Builds this extension into `dist/`, which is the whole of what ACE Studio loads:
// the manifest at its root, the process bundle beside it, and the page under `ui/`.
// Dev-load it with `npm run load`; seal it with `npm run package`.
import { rm } from "node:fs/promises";
import { build } from "esbuild";
import { writeManifestJson } from "@timedomain/acestudio-extension-sdk";

const OUT_DIR = "dist";

await rm(OUT_DIR, { recursive: true, force: true });

// The process side, bundled: ACE Studio runs `index.js` on its own Node with nothing
// installed next to it, so every import has to already be in the file.
await build({
  entryPoints: ["src/index.ts"],
  outfile: `${OUT_DIR}/index.js`,
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node24",
  sourcemap: true,
  logLevel: "info",
});

// The page, built for a browser: `platform: "browser"` is what turns a stray Node
// import in the UI's graph into a build error here rather than a blank window later.
await build({
  entryPoints: ["ui/main.ts", "ui/index.html"],
  outdir: `${OUT_DIR}/ui`,
  bundle: true,
  platform: "browser",
  format: "esm",
  target: "es2023",
  loader: { ".html": "copy" },
  sourcemap: true,
  logLevel: "info",
});

await emitManifest();

/**
 * Emit `dist/manifest.json` from `src/manifest.ts` — the JSON ACE Studio and the
 * signing service read, and the bytes the signature covers.
 *
 * The manifest is TypeScript so the capability list stays literal and the client is
 * typed down to it, which means the build has to run it to get the JSON. It is types
 * and one object literal, so bundling it produces a module that imports nothing and
 * can be handed straight to `import()` — cheaper than a second toolchain, and no temp
 * file to clean up. `writeManifestJson` runs the host's own manifest checks on the way
 * through, so a manifest that would not install fails here instead of at install time.
 */
async function emitManifest() {
  const bundled = await build({
    entryPoints: ["src/manifest.ts"],
    bundle: true,
    format: "esm",
    platform: "neutral",
    write: false,
    logLevel: "silent",
  });
  const source = bundled.outputFiles[0].text;
  const { manifest } = await import(`data:text/javascript,${encodeURIComponent(source)}`);
  const written = await writeManifestJson(manifest, OUT_DIR);
  console.log(`  ${written}`);
}
