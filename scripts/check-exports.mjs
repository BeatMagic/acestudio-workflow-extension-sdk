// Validates the surface of every package that goes to npm: publint lints the manifest,
// and are-the-types-wrong (attw) checks that each exports entry resolves to types that
// match under each module resolution mode, including the ./page subpath split of the
// extension SDK.
//
// attw is the gate that matters most here and reads least like it. The repo typechecks
// with `moduleResolution: "bundler"`, which forgives an extensionless relative specifier;
// a consumer of the emitted .d.ts resolves under node16/nodenext, which does not. So the
// declarations can be unusable to everyone outside this repo while every check inside it
// passes, and attw against a packed tarball is what closes that gap.
import { execFileSync } from "node:child_process";
import { publint } from "publint";
import { formatMessage } from "publint/utils";
import { abs, PUBLISHED_PACKAGES, TYPED_PACKAGES } from "./_lib.mjs";

let failed = false;

for (const dir of PUBLISHED_PACKAGES) {
  const { messages, pkg } = await publint({ pkgDir: abs(dir), strict: true });
  if (messages.length > 0) {
    failed = true;
    console.error(`publint: ${pkg.name}`);
    for (const message of messages) console.error(`  ${formatMessage(message, pkg)}`);
  } else {
    console.log(`publint: ${pkg.name} — ok`);
  }
}

if (failed) process.exit(1);

// attw runs from the CLI. The packages are ESM-only (type: module, Node >=24),
// so the esm-only profile is correct: it ignores the CJS-consumer resolutions
// that do not apply here. Invoked via `node <entry>` for Windows parity, the
// same as scripts/build.mjs.
const attw = abs("node_modules/@arethetypeswrong/cli/dist/index.js");
for (const dir of TYPED_PACKAGES) {
  execFileSync(process.execPath, [attw, "--pack", abs(dir), "--profile", "esm-only"], { stdio: "inherit" });
}
