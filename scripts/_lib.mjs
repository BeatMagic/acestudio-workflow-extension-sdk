// Shared helpers for the workspace build and validate scripts.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repoRoot = new URL("../", import.meta.url);

// Resolve a repo-root-relative path to an absolute filesystem path.
export const abs = (p) => fileURLToPath(new URL(p, repoRoot));

const manifest = (dir) => JSON.parse(readFileSync(abs(`${dir}/package.json`), "utf8"));

// Every package directory, in a stable order.
const ALL_PACKAGES = readdirSync(abs("packages"))
  .map((name) => `packages/${name}`)
  .filter((dir) => existsSync(abs(`${dir}/package.json`)))
  .sort();

// The three scopes the surface gates apply to. Each is *derived* rather than listed,
// because a hand-maintained list is how a published package comes to sit outside the
// gate that exists to check it, silently, and for as many releases as nobody looks.
//
// Everything that goes to npm. This is what publint judges, since its subject is the manifest
// and every published manifest has one to get wrong.
export const PUBLISHED_PACKAGES = ALL_PACKAGES.filter((dir) => manifest(dir).private !== true);

// Of those, the ones that ship type declarations. This is what attw judges, since it asks
// whether a consumer's resolver can follow them. A bin has none to follow.
export const TYPED_PACKAGES = PUBLISHED_PACKAGES.filter((dir) => manifest(dir).types !== undefined);

// The packages that hold themselves to a reviewed API surface: an api-extractor config
// is the commitment, so its presence is the membership test.
export const LIBRARY_PACKAGES = PUBLISHED_PACKAGES.filter((dir) => existsSync(abs(`${dir}/api-extractor.json`)));
