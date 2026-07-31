// The manifest, as TypeScript. `npm run build` emits it as `dist/manifest.json`,
// which is the only form ACE Studio and the signing service read.
//
// `as const satisfies ExtensionManifest` is what makes it worth having in TypeScript:
// `satisfies` checks every field (and rejects a stray one), while `as const` keeps the
// capability names literal — which is what types `ctx.client` down to exactly this
// list, so a call this manifest does not ask for will not compile.
import type { ExtensionManifest } from "@timedomain/acestudio-workflow-extension-sdk";

export const manifest = {
  // `developer-slug.extension-slug`. The developer slug is yours to choose and the
  // signing service reads it straight out of here, so settle on one before you sign.
  id: "{{extensionId}}",
  name: "{{extensionName}}",
  version: "0.1.0",
  publisher: "{{publisher}}",
  description: "{{description}}",
  // `persistent`: spawned when the user opens this extension's window, alive until
  // they stop it. Use `one-shot` for a workflow that runs its work through and exits.
  lifecycle: "persistent",
  // Every capability this extension asks for, and the whole of what it can reach.
  // Adding one here is what makes the matching `ctx.client` call compile.
  capabilities: ["workflow.ui", "project.read"],
  // Bundle-relative — the bundle root is `dist/`, so this is `dist/index.js` on disk.
  entry: "index.js",
} as const satisfies ExtensionManifest;
