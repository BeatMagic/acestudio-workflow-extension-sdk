// Freshness gate for the committed API docs under docs/api. Regenerates typedoc
// into a temp directory and diffs it file-for-file against the committed output,
// failing if anything is added, removed, or changed — so the docs can never
// drift from the source without a `npm run docs` + commit.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { abs } from "./_lib.mjs";

const committed = abs("docs/api");
const tmp = mkdtempSync(join(tmpdir(), "aceext-docs-"));

// Normalize line endings so a CRLF checkout (git autocrlf on Windows) does not
// diff against typedoc's LF output and report a false "stale" result.
const read = (path) => readFileSync(path, "utf8").replace(/\r\n/g, "\n");

const walk = (root, dir = root, files = new Map()) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(root, full, files);
    else files.set(relative(root, full), read(full));
  }
  return files;
};

try {
  execFileSync(process.execPath, [abs("node_modules/typedoc/bin/typedoc"), "--out", tmp], { stdio: "inherit" });

  const fresh = walk(tmp);
  const current = walk(committed);
  const added = [...fresh.keys()].filter((f) => !current.has(f));
  const removed = [...current.keys()].filter((f) => !fresh.has(f));
  const changed = [...fresh.keys()].filter((f) => current.has(f) && current.get(f) !== fresh.get(f));

  if (added.length || removed.length || changed.length) {
    console.error("docs/api is stale. Run `npm run docs` and commit the result.");
    for (const f of added) console.error(`  added:   ${f}`);
    for (const f of removed) console.error(`  removed: ${f}`);
    for (const f of changed) console.error(`  changed: ${f}`);
    process.exit(1);
  }
  console.log("docs/api is up to date.");
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
