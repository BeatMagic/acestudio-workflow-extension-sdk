# Source resolution

How a cross-package import (`@timedomain/x` importing `@timedomain/y`) picks a
file, in-repo and for published consumers.

## Mechanism

Each package's `exports` map resolves two ways — TypeScript source in-repo,
built `dist/` for consumers:

```json
{
  "exports": {
    ".": {
      "acestudio:source": "./src/index.ts",
      "types": "./dist/src/index.d.ts",
      "default": "./dist/index.js"
    }
  }
}
```

`acestudio:source` is a custom [export condition](https://nodejs.org/api/packages.html#conditional-exports).
The in-repo tools request it, so inside the repo every cross-package import
resolves to TypeScript source and no build step is needed:

| Tool | Where it requests the condition |
| ---- | ------------------------------- |
| tsc | `customConditions` in `tsconfig.json` |
| esbuild | `conditions` in `scripts/build.mjs` |
| vitest | `ssr.resolve.conditions` in `vitest.config.ts` |

No outside tool requests the condition, so published consumers fall through to
`dist/`. The `src/` target still ships in every tarball (`files` includes
`src`), so the entry is never a dead link and publint runs with no exceptions.

## Rules

- Never name the condition `development` (or any registered community
  condition): bundlers resolve those for consumers automatically — Vite's
  defaults include `development|production` — which pointed real consumers at
  unpublished files in 0.1.0.
- Keep `src` in every package's `files`; removing it dangles the condition
  target again.
- Don't add per-package alias/paths mappings to tool configs; the condition is
  the single mechanism. Aliases also hide stale-`dist` bugs — the test suite
  must pass with every `dist/` deleted.
- vitest: the node environment reads `ssr.resolve.conditions`, not
  `resolve.conditions`, and on Vite 6+ setting it replaces the defaults —
  spread `defaultServerConditions` back in.
