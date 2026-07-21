# Building & publishing

The workspace packages publish to npm under the `@timedomain` scope:

| Package                              | Role                                                        |
| ------------------------------------ | ----------------------------------------------------------- |
| `@timedomain/workflowext-signed-json`| Signed-JSON primitives (Ed25519 over exact stored bytes)    |
| `@timedomain/workflowext-wire-schemas`| Versioned JSON Schemas for the wire formats                 |
| `@timedomain/workflowext-verifier`   | Reference verifier for the client verification policy       |
| `@timedomain/aceworkflow`            | The `aceworkflow` CLI (pack, submit, verify bundles)        |

## Build

```sh
npm run build
```

`scripts/build.mjs` bundles every package to `dist/` with esbuild and emits `.d.ts`
declarations for the three libraries with `tsc`. The bundle resolves the
extensionless relative imports Node's ESM loader rejects, so the output runs under
plain `node`.

### Source-first development

Packages are consumed as TypeScript source in-repo (Node type-stripping, vitest) —
there is no build step for day-to-day work. This is expressed with a `development`
export condition on each package that points back at `src/`:

- `tsc` picks it up via `customConditions` in the root `tsconfig.json`.
- vitest picks it up via `resolve.alias` in `vitest.config.ts`.
- the bundler picks it up via `conditions` in `scripts/build.mjs`.

Published consumers have no `development` condition, so they resolve to `dist/`
through the `default`/`types` entries.

### The CLI is self-contained

`aceworkflow` bundles the three contract packages into its output, so the installed
CLI has a single runtime dependency: the native keychain binding
(`@napi-rs/keyring`). The default trust anchor (`roots/production.json`) is inlined
at build time, so the bin needs no data file beside it. The result runs from a
packed tarball:

```sh
npm pack -w @timedomain/aceworkflow
# install the tarball in a fresh project, then:
npx aceworkflow --help
```

## Publishing (manual)

Publishing is a deliberate manual step; there is no CI publish job. The packages are
`private: true` and have not been published. To publish:

1. Set `private: false` on the packages going public.
2. Pin the inter-package dependency versions (they are `*` for in-repo workspace
   resolution — npm does not rewrite them on publish).
3. `npm publish -w <package>` — `prepack` builds automatically, and `publishConfig`
   sets `access: public` for the scoped packages.

## Notes

- The real `bin`/`main`/`exports` fields point at `dist/`; `publishConfig` is not
  used to swap them, because the packaging-field override is not applied by every
  npm version. The `development` condition is what keeps dev tooling on `src/`.
- Library declarations emit under `dist/src/` — that is the path the `types`
  entries reference.
