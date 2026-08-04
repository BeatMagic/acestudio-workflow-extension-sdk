// The scaffolder's promise, asserted mechanically: `npm create` emits an extension
// that installs, typechecks, and builds with no ACE Studio anywhere — and
// `aceworkflow init`, the CLI's door onto the same scaffolder, emits that same tree.
//
// Everything runs from packed tarballs rather than from the workspace, so the check
// also covers what actually ships — a template file missing from `files` would emit a
// broken scaffold here and nowhere else. The SDK tarballs are injected into the
// scaffold rather than resolved from the registry on purpose, and not as a stopgap for
// the unpublished packages: the scaffold this commit emits belongs against the SDK
// this commit builds, which is the drift a released version could not catch.
//
// The `init` leg is here for the same reason and not out of symmetry. The CLI's bundle
// keeps the scaffolder external precisely because the templates are read relative to
// the scaffolder's own module, and nothing that runs from source can tell whether that
// held: in-repo, the import resolves to the scaffolder either way.
//
// Run it standalone (`node scripts/smoke-scaffold.mjs`) after `npm run build`; CI runs
// it as the last leg of validate.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, sep } from "node:path";
import { abs } from "./_lib.mjs";

const EXTENSION_ID = "acme.stem-tools";

/** What the built bundle must contain to be loadable at all. */
const REQUIRED_BUNDLE_FILES = ["manifest.json", "index.js", "ui/index.html", "ui/main.js"];

/** `defineExtension`'s "the run never started" code — what an entry with no spawn environment exits with. */
const EXIT_NOT_STARTED = 2;

// npm and npx are shell scripts on Windows, which execFile cannot launch directly.
const shell = process.platform === "win32";

const work = mkdtempSync(join(tmpdir(), "scaffold-smoke-"));

/** Runs a command, streaming its output. Throws — and so fails the smoke — if it does. */
const run = (command, args, cwd) => execFileSync(command, args, { cwd, stdio: "inherit", shell });

/** Packs a workspace package and returns the tarball's absolute path. */
const pack = (name) => {
  // --ignore-scripts skips the prepack hook so pack reuses the dist/ that
  // `npm run build` already produced instead of rebuilding the workspace per package.
  const out = execFileSync(
    "npm",
    ["pack", "-w", name, "--ignore-scripts", "--pack-destination", work, "--loglevel", "error"],
    { cwd: abs("."), encoding: "utf8", shell },
  );
  return join(work, out.trim().split("\n").at(-1));
};

/** Every file under `root`, as POSIX path → bytes. */
const treeOf = (root, dir = root, files = new Map()) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) treeOf(root, full, files);
    else files.set(relative(root, full).split(sep).join("/"), readFileSync(full));
  }
  return files;
};

/** Throws unless the two trees hold the same paths with the same bytes. */
const assertSameTree = (left, right) => {
  const [a, b] = [treeOf(left), treeOf(right)];
  const paths = [...new Set([...a.keys(), ...b.keys()])].sort();
  for (const path of paths) {
    if (!a.has(path) || !b.has(path)) {
      throw new Error(`${path} was emitted by only one of the two doors`);
    }
    if (!a.get(path).equals(b.get(path))) {
      throw new Error(`${path} differs between the two doors`);
    }
  }
  if (paths.length === 0) throw new Error("neither door emitted anything");
  return paths.length;
};

/**
 * How the built entry behaves when it is started with no ACE Studio to talk to. It
 * should refuse — which is a non-zero exit, so the code arrives on a thrown error.
 */
const exitCodeOfEntry = (dist) => {
  try {
    execFileSync(process.execPath, [join(dist, "index.js")], {
      cwd: dist,
      stdio: ["ignore", "inherit", "inherit"],
      // A spawn environment inherited from a Studio-launched shell would let it dial a
      // real bridge; this asserts the no-Studio case, so it gets none of it.
      env: { PATH: process.env.PATH ?? "" },
    });
    return 0;
  } catch (error) {
    if (typeof error.status !== "number") throw error;
    return error.status;
  }
};

try {
  console.log(`smoke: packing the workspace into ${work}`);
  const core = pack("@timedomain/acestudio-bridge-core");
  const sdk = pack("@timedomain/acestudio-workflow-extension-sdk");
  const scaffolder = pack("@timedomain/create-acestudio-workflow-extension");

  // The scaffolder, installed the way a developer gets it: from the tarball, into an
  // empty project, and invoked through its bin.
  const runner = join(work, "runner");
  mkdirSync(runner);
  run("npm", ["init", "-y", "--loglevel", "error"], runner);
  run("npm", ["install", scaffolder, "--loglevel", "error"], runner);

  console.log("smoke: scaffolding");
  const identity = ["--id", EXTENSION_ID, "--name", "Stem Tools", "--publisher", "Acme Audio"];
  // `--no-install` is what keeps this test honest: without it, an npx that failed to find
  // the bin just installed by name would fetch a published one from the registry and pass,
  // reporting a green smoke for a tarball it never ran.
  run("npx", ["--no-install", "create-acestudio-workflow-extension", "stem-tools", ...identity], runner);

  const project = join(runner, "stem-tools");

  // The CLI's second door onto the same scaffolder, from the packed CLI. The override
  // pins the scaffolder it reaches to this commit's tarball rather than whatever the
  // registry hands back for the declared range — which is also the only way to install
  // the CLI before the tag that stages them both has gone out.
  //
  // Scaffolded under the same basename, in its own parent: the emitted package name
  // comes from the directory's basename, so a differing name would leave the
  // comparison below reporting a difference that is only the two names.
  console.log("smoke: scaffolding again through `aceworkflow init`");
  const cli = pack("@timedomain/aceworkflow");
  const door = join(work, "door");
  mkdirSync(door);
  run("npm", ["init", "-y", "--loglevel", "error"], door);
  run("npm", ["pkg", "set", `overrides.@timedomain/create-acestudio-workflow-extension=file:${scaffolder}`], door);
  run("npm", ["install", cli, "--loglevel", "error"], door);
  run("npx", ["--no-install", "aceworkflow", "init", "stem-tools", ...identity, "-y"], door);

  const shared = assertSameTree(project, join(door, "stem-tools"));
  console.log(`smoke: both doors emitted the same ${shared} files`);
  // The scaffold asks for the published SDK; point it at this commit's instead. The
  // direct dependency is replaced outright and its own peer overridden, because npm
  // refuses an override that contradicts a direct dependency.
  run("npm", ["pkg", "set", `dependencies.@timedomain/acestudio-workflow-extension-sdk=file:${sdk}`], project);
  run("npm", ["pkg", "set", `overrides.@timedomain/acestudio-bridge-core=file:${core}`], project);

  console.log("smoke: install → typecheck → build");
  run("npm", ["install", "--loglevel", "error"], project);
  run("npm", ["run", "typecheck"], project);
  run("npm", ["run", "build"], project);

  const dist = join(project, "dist");
  for (const file of REQUIRED_BUNDLE_FILES) {
    readFileSync(join(dist, file));
  }

  const manifest = JSON.parse(readFileSync(join(dist, "manifest.json"), "utf8"));
  if (manifest.id !== EXTENSION_ID) {
    throw new Error(`the emitted manifest says id ${JSON.stringify(manifest.id)}, not ${EXTENSION_ID}`);
  }

  // The bundle loads. Running the entry with nothing to connect to should reach
  // `defineExtension` and be refused there; a module that will not resolve or a syntax
  // error lands on some other code, and a clean exit would mean it never tried.
  const code = exitCodeOfEntry(dist);
  if (code !== EXIT_NOT_STARTED) {
    throw new Error(`the built entry exited ${code}, not the ${EXIT_NOT_STARTED} of a run that never started`);
  }

  console.log("smoke: ok");
} catch (error) {
  console.error(`smoke: failed — ${error.message}`);
  process.exitCode = 1;
} finally {
  rmSync(work, { recursive: true, force: true });
}
