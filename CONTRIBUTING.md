# Contributing guide for internal teams

This guide covers the repo layout, the local development workflow, and how the
build works.

## Prerequisites

- Node.js ≥ 24 (the packages rely on native TypeScript type-stripping)

## Packages

This is an npm workspaces monorepo. The packages are scoped under `@timedomain`:

| Package                                | Role                                                     |
| -------------------------------------- | -------------------------------------------------------- |
| `@timedomain/aceworkflow`              | The `aceworkflow` CLI: pack, submit, and verify bundles  |
| `@timedomain/workflowext-verifier`     | Reference verifier for the client verification policy    |
| `@timedomain/workflowext-signed-json`  | Signed-JSON primitives (Ed25519 over exact stored bytes) |
| `@timedomain/workflowext-wire-schemas` | Versioned JSON Schemas for the wire formats              |

## Development

Packages are consumed as TypeScript **source** in-repo — there is no build step
for day-to-day work.

```sh
npm install       # install workspace dependencies
npm run typecheck # tsc --noEmit
npm test          # vitest
npm run build     # bundle every package to dist/ (see "Build" below)
```

Source-first resolution is expressed with a `development` export condition on each
package that points back at `src/`:

- `tsc` picks it up via `customConditions` in the root `tsconfig.json`.
- vitest picks it up via `resolve.alias` in `vitest.config.ts`.
- the bundler picks it up via `conditions` in `scripts/build.mjs`.

Anything consuming a built package (rather than the workspace) has no `development`
condition, so it resolves to `dist/` through the `default`/`types` entries.

## Build

```sh
npm run build
```

`scripts/build.mjs` bundles every package to `dist/` with esbuild and emits `.d.ts`
declarations for the three libraries with `tsc`. The bundle resolves the
extensionless relative imports Node's ESM loader rejects, so the output runs under
plain `node`.

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

The packages are `private: true` and are not published to npm — they are consumed
as source within this repo. Releasing, when it happens, is a deliberate manual step;
there is no CI publish job. To publish:

1. Set `private: false` on the packages being released.
2. Pin the inter-package dependency versions (they are `*` for in-repo workspace
   resolution — npm does not rewrite them on publish).
3. `npm publish -w <package>` — `prepack` builds automatically, and `publishConfig`
   sets `access: public` for the scoped packages.

## Notes

- The real `bin`/`main`/`exports` fields point at `dist/`; the `development`
  condition (not `publishConfig` field-swapping, which not every npm version
  applies) is what keeps local tooling on `src/`.
- Library declarations emit under `dist/src/` — that is the path the `types`
  entries reference.
