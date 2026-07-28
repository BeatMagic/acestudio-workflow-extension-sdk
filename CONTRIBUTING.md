# Contributing guide for internal teams

This guide covers the repo layout, the local development workflow, the validate
pipeline, and how the build works.

## Prerequisites

- Node.js ≥ 24 (the packages rely on native TypeScript type-stripping)

## Packages

This is an npm workspaces monorepo. The packages are scoped under `@timedomain`.

The extension SDK:

| Package                                  | Role                                                                   |
| ---------------------------------------- | ---------------------------------------------------------------------- |
| `@timedomain/acestudio-extension-sdk`    | The SDK for building extensions: `defineExtension`, lifecycle, UI      |
| `@timedomain/acestudio-bridge-core`      | The connection core beneath the SDK: handshake, bindings, jobs, errors |
| `@timedomain/create-acestudio-extension` | The `npm create`-native scaffolder for a new extension                 |

Signing and submission tooling:

| Package                                | Role                                                     |
| -------------------------------------- | -------------------------------------------------------- |
| `@timedomain/aceworkflow`              | The `aceworkflow` CLI: pack, submit, and verify bundles  |
| `@timedomain/workflowext-verifier`     | Reference verifier for the client verification policy    |
| `@timedomain/workflowext-signed-json`  | Signed-JSON primitives (Ed25519 over exact stored bytes) |
| `@timedomain/workflowext-wire-schemas` | Versioned JSON Schemas for the wire formats              |

`acestudio-bridge-core` carries the transport seam, `connect()`, the error class,
the generated domain bindings with their grants and pre-wire capability guard, and
the compile-time capability facade; typed job handles and typed-array bulk data
land on top of them. The extension SDK and the scaffolder are still skeletons —
they build and are wired into the pipeline, but their public API is filled in by
subsequent slices. All three are versioned `0.0.0` until their first release. The
name `@timedomain/acestudio-sdk` is intentionally left unclaimed, reserved for a
future umbrella package.

Bridge-core tests drive the real stack over an in-memory transport pair against
`packages/acestudio-bridge-core/test/support/host-peer.ts` — a scripted stand-in
for the Studio side, serving the surfaces the schemas declare: the handshake, the
liveness ping, the shutdown notice, and `operation.invoke`. Its capability gate is
a transcription of the Studio's, reading the same generated required-token table,
so a refusal it composes is the one the real host would send. It grows as the
surface does; later slices test against the same peer rather than mocking the
layer under test.

## Development

Packages are consumed as TypeScript **source** in-repo — there is no build step
for day-to-day work.

```sh
npm install       # install workspace dependencies
npm run typecheck # tsc --noEmit
npm test          # vitest
npm run build     # bundle every package to dist/ (see "Build" below)
npm run validate  # the full pipeline CI runs (see "Validate pipeline" below)
```

Source-first resolution is expressed with a `development` export condition on each
package that points back at `src/`:

- `tsc` picks it up via `customConditions` in the root `tsconfig.json`.
- vitest picks it up via `resolve.alias` in `vitest.config.ts`.
- the bundler picks it up via `conditions` in `scripts/build.mjs`.

Anything consuming a built package (rather than the workspace) has no `development`
condition, so it resolves to `dist/` through the `default`/`types` entries.

## Validate pipeline

`npm run validate` runs the full quality pipeline, in order:

```
lint → typecheck → test → build → api:check → check:exports → docs:check
```

CI runs the same pipeline through the reusable `.github/workflows/_validate.yml`
workflow (used by both `ci.yml` and `publish.yml`). Node is gated in CI only —
it is not part of the published contract: Node 24 is the required leg and Node 26
runs as a non-blocking canary.

The **surface gates** — `api:check`, `check:exports`, `docs:check` — apply to the
type-bearing library packages (`acestudio-bridge-core` and
`acestudio-extension-sdk`). The CLI and the scaffolder ship as bins with no public
type surface, so they are outside those gates; the CLI has its own pack-and-run
smoke check instead.

### API reports (api-extractor)

Each library package commits an API report under `packages/<pkg>/etc/<name>.api.md`.
`api:check` regenerates the report from the built `.d.ts` and fails if it differs
from the committed one — so a change to the public surface can never land silently
(this is where the "removing public API is a major bump" rule becomes observable).
After an **intended** API change, refresh the reports and commit them:

```sh
npm run build      # api-extractor reads dist/src/index.d.ts
npm run api:update  # rewrite the committed reports
```

api-extractor snapshots the package's `.` entry. The extension SDK's `./page`
subpath is guarded by `docs:check` and `check:exports` instead.

### API docs (typedoc)

`docs` generates the Markdown API reference into `docs/api/`, which is committed.
`docs:check` regenerates into a temp directory and diffs it against the committed
output, failing on any drift. After an intended change, refresh and commit:

```sh
npm run docs
```

### Package surface (publint + are-the-types-wrong)

`check:exports` runs publint and attw over the library packages, checking that
every `exports` entry (including the `./page` subpath) resolves to matching types.
The packages are ESM-only, so attw uses the `esm-only` profile. publint's one
expected finding — the `development` condition pointing at unpublished source — is
suppressed in `scripts/check-exports.mjs`; every other finding is a real error.

## Build

```sh
npm run build
```

`scripts/build.mjs` bundles every package to `dist/` with esbuild and emits `.d.ts`
declarations with `tsc` for every package that has a public type surface. The
bundle resolves the extensionless relative imports Node's ESM loader rejects, so
the output runs under plain `node`.

### The CLI is self-contained

`aceworkflow` bundles the three contract packages into its output, so the built CLI
has a single runtime dependency: the native keychain binding (`@napi-rs/keyring`).
The default trust anchor (`roots/production.json`) is inlined at build time, so the
bin needs no data file beside it. The result runs from a packed tarball:

```sh
npm pack -w @timedomain/aceworkflow
# install the tarball in a fresh project, then:
npx aceworkflow --help
```

CI runs this same pack-and-run check on every pull request.

## Releasing (maintainers)

Publishing is staged from CI on a version tag (`v*`) via npm trusted publishing —
see `.github/workflows/publish.yml`. CI can only *queue* a release; a maintainer
approves it with 2FA before it goes live, and each package name needs its own
stage-only trusted publisher configured on npmjs.com first.

## Notes

- The real `bin`/`main`/`exports` fields point at `dist/`; the `development`
  condition (not `publishConfig` field-swapping, which not every npm version
  applies) is what keeps local tooling on `src/`.
- Library declarations emit under `dist/src/` — that is the path the `types`
  entries reference.
